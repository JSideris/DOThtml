import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DOM_TESTS = [
	{ id: 'run', name: 'Create 1,000 rows', batch: 10 },
	{ id: 'runlots', name: 'Create 10,000 rows', batch: 1 },
	{ id: 'add', name: 'Append 1,000 rows', setup: 'run', batch: 10 },
	{ id: 'update', name: 'Update every 10th row', batch: 100 },
	{ id: 'swaprows', name: 'Swap Rows', batch: 100 },
	{ id: 'clear', name: 'Clear', batch: 10 }
];

function parseArgs() {
	const config = { iterations: 5, warmup: 1, suites: 1 };

	for (const arg of process.argv.slice(2)) {
		if (arg.startsWith('--iterations=')) {
			config.iterations = Math.max(1, parseInt(arg.split('=')[1], 10) || 5);
		} else if (arg.startsWith('--warmup=')) {
			config.warmup = Math.max(0, parseInt(arg.split('=')[1], 10) || 1);
		} else if (arg.startsWith('--suites=')) {
			config.suites = Math.max(1, parseInt(arg.split('=')[1], 10) || 1);
		} else if (arg === '--help' || arg === '-h') {
			console.log(`Usage: node runner.js [options]

Options:
  --iterations=N   Measured runs per test (default: 5)
  --warmup=N       Unrecorded warmup runs per test (default: 1)
  --suites=N       Full benchmark repetitions; headline uses median across suites (default: 1)
  --help, -h       Show this help
`);
			process.exit(0);
		}
	}

	return config;
}

function mean(values) {
	return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function median(values) {
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0
		? (sorted[mid - 1] + sorted[mid]) / 2
		: sorted[mid];
}

function stddev(values) {
	const avg = mean(values);
	return Math.sqrt(values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length);
}

function summarizeSamples(samples) {
	return {
		mean: mean(samples),
		median: median(samples),
		stddev: stddev(samples),
		min: Math.min(...samples),
		max: Math.max(...samples),
		samples
	};
}

function formatStat(value) {
	return value.toFixed(2);
}

/**
 * Time from click through next paint. Click goes through Playwright (shadow-DOM safe);
 * timing and rAF wait run in the browser to exclude Playwright overhead.
 * Supports batching by triggering multiple clicks synchronously.
 */
async function measureClick(page, buttonId, batch = 1) {
	await page.evaluate(({ id, count }) => {
		window.__benchResult = null;
		performance.clearMarks();
		performance.clearMeasures();
		const listener = (e) => {
			const path = e.composedPath();
			const match = path.some(el => el.id === id);
			
			if (match) {
				performance.mark('bench-start');
				window.removeEventListener('click', listener, true);
				
				const el = document.getElementById(id);
				if (el) {
					// Perform additional clicks synchronously to amplify the work
					for (let i = 1; i < count; i++) {
						el.click();
					}
				}
				
				// Wait for the next paint
				requestAnimationFrame(() => {
					setTimeout(() => {
						performance.mark('bench-end');
						try {
							performance.measure('bench-duration', 'bench-start', 'bench-end');
							const entries = performance.getEntriesByName('bench-duration');
							window.__benchResult = entries.length > 0 ? entries[0].duration : 0.001;
						} catch (err) {
							console.error('Measurement error:', err);
							window.__benchResult = 0.001;
						}
					}, 0);
				});
			}
		};
		window.addEventListener('click', listener, true);
	}, { id: buttonId, count: batch });

	await page.click(`#${buttonId}`);

	try {
		await page.waitForFunction(() => window.__benchResult !== null, { timeout: 10000 });
		const totalDuration = await page.evaluate(() => window.__benchResult);
		return totalDuration / batch;
	} catch (e) {
		const exists = await page.$(`#${buttonId}`).then(el => !!el);
		throw new Error(`Benchmark timer failed to trigger for button #${buttonId}. Element exists: ${exists}. This usually happens if the click event was intercepted or the element was removed before the listener could catch it.`);
	}
}

async function clickAndWait(page, buttonId) {
	await page.click(`#${buttonId}`);
	await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0))));
}

async function setupTest(page, setupId) {
	if (setupId) {
		await clickAndWait(page, setupId);
	}
}

async function resetAfterTest(page, testId) {
	if (testId !== 'clear') {
		await clickAndWait(page, 'clear');
	}
}

async function runTestIterations(page, test, config) {
	for (let i = 0; i < config.warmup; i++) {
		await setupTest(page, test.setup);
		await measureClick(page, test.id, test.batch);
		await resetAfterTest(page, test.id);
	}

	const samples = [];
	for (let i = 0; i < config.iterations; i++) {
		await setupTest(page, test.setup);
		samples.push(await measureClick(page, test.id, test.batch));
		await resetAfterTest(page, test.id);
	}

	return summarizeSamples(samples);
}

async function runColdStartBenchmarks(page, url, config) {
	const samples = {
		fcp: [],
		domInteractive: [],
		frameworkReady: []
	};

	for (let i = 0; i < config.iterations; i++) {
		await page.goto('about:blank'); // Ensure a fresh start
		await page.goto(url, { waitUntil: 'networkidle' });

		const timings = await page.evaluate(() => {
			const [nav] = performance.getEntriesByType('navigation');
			const [fcpEntry] = performance.getEntriesByType('paint').filter(e => e.name === 'first-contentful-paint');
			const [readyEntry] = performance.getEntriesByName('framework-ready');

			return {
				fcp: fcpEntry ? fcpEntry.startTime : null,
				domInteractive: nav ? nav.domInteractive : null,
				frameworkReady: readyEntry ? readyEntry.startTime : null
			};
		});

		if (timings.fcp) samples.fcp.push(timings.fcp);
		if (timings.domInteractive) samples.domInteractive.push(timings.domInteractive);
		if (timings.frameworkReady) samples.frameworkReady.push(timings.frameworkReady);
	}

	return {
		'First Contentful Paint': summarizeSamples(samples.fcp),
		'DOM Interactive': summarizeSamples(samples.domInteractive),
		'Framework Ready': summarizeSamples(samples.frameworkReady)
	};
}

async function runDomBenchmarks(page, framework, config) {
	const results = {};

	for (const test of DOM_TESTS) {
		results[test.name] = await runTestIterations(page, test, config);
	}

	return results;
}

async function runStylingBenchmarks(page, config) {
	const testName = 'Bulk Style Update';
	const buttonId = 'update-styles';
	const batch = 100;

	for (let i = 0; i < config.warmup; i++) {
		await measureClick(page, buttonId, batch);
	}

	const samples = [];
	for (let i = 0; i < config.iterations; i++) {
		samples.push(await measureClick(page, buttonId, batch));
	}

	return { [testName]: summarizeSamples(samples) };
}

function combineSuiteResults(suiteRuns) {
	const frameworks = Object.keys(suiteRuns[0].dom);
	const combined = { coldStart: {}, dom: {}, styling: {} };

	for (const framework of frameworks) {
		combined.coldStart[framework] = {};
		const coldStartTestNames = Object.keys(suiteRuns[0].coldStart[framework]);
		for (const testName of coldStartTestNames) {
			const suiteMedians = suiteRuns.map(run => run.coldStart[framework][testName].median);
			combined.coldStart[framework][testName] = {
				mean: median(suiteRuns.map(run => run.coldStart[framework][testName].mean)),
				median: median(suiteMedians),
				stddev: mean(suiteRuns.map(run => run.coldStart[framework][testName].stddev)),
				min: Math.min(...suiteRuns.flatMap(run => run.coldStart[framework][testName].samples)),
				max: Math.max(...suiteRuns.flatMap(run => run.coldStart[framework][testName].samples)),
				samples: suiteRuns.flatMap(run => run.coldStart[framework][testName].samples),
				suiteMedians
			};
		}

		combined.dom[framework] = {};
		const domTestNames = Object.keys(suiteRuns[0].dom[framework]);
		for (const testName of domTestNames) {
			const suiteMedians = suiteRuns.map(run => run.dom[framework][testName].median);
			combined.dom[framework][testName] = {
				mean: median(suiteRuns.map(run => run.dom[framework][testName].mean)),
				median: median(suiteMedians),
				stddev: mean(suiteRuns.map(run => run.dom[framework][testName].stddev)),
				min: Math.min(...suiteRuns.flatMap(run => run.dom[framework][testName].samples)),
				max: Math.max(...suiteRuns.flatMap(run => run.dom[framework][testName].samples)),
				samples: suiteRuns.flatMap(run => run.dom[framework][testName].samples),
				suiteMedians
			};
		}

		combined.styling[framework] = {};
		const stylingTestNames = Object.keys(suiteRuns[0].styling[framework]);
		for (const testName of stylingTestNames) {
			const suiteMedians = suiteRuns.map(run => run.styling[framework][testName].median);
			combined.styling[framework][testName] = {
				mean: median(suiteRuns.map(run => run.styling[framework][testName].mean)),
				median: median(suiteMedians),
				stddev: mean(suiteRuns.map(run => run.styling[framework][testName].stddev)),
				min: Math.min(...suiteRuns.flatMap(run => run.styling[framework][testName].samples)),
				max: Math.max(...suiteRuns.flatMap(run => run.styling[framework][testName].samples)),
				samples: suiteRuns.flatMap(run => run.styling[framework][testName].samples),
				suiteMedians
			};
		}
	}

	return combined;
}

function buildSummaryTable(results, testNames) {
	const table = {};
	for (const framework of Object.keys(results)) {
		table[framework] = {};
		for (const testName of testNames) {
			table[framework][testName] = formatStat(results[framework][testName].median);
		}
	}
	return table;
}

function writeReport(config, results) {
	const coldStartTestNames = Object.keys(results.coldStart.dothtml);
	const domTestNames = Object.keys(results.dom.dothtml);
	const stylingTestNames = Object.keys(results.styling.dothtml);

	let report = '# Framework Benchmark Results\n\n';
	report += `Configuration: ${config.iterations} iterations, ${config.warmup} warmup, ${config.suites} suite(s). Timings measured in-browser with \`performance.now()\`.\n\n`;

	report += '## Cold Start & Initialization (Median ms)\n\n';
	report += '| Test | DOThtml | React | Vue | Svelte |\n';
	report += '| --- | --- | --- | --- | --- |\n';
	for (const testName of coldStartTestNames) {
		report += `| ${testName} | ${formatStat(results.coldStart.dothtml[testName].median)}ms | ${formatStat(results.coldStart.react[testName].median)}ms | ${formatStat(results.coldStart.vue[testName].median)}ms | ${formatStat(results.coldStart.svelte[testName].median)}ms |\n`;
	}

	report += '\n## DOM Operations (Median ms)\n\n';
	report += '| Test | DOThtml | React | Vue | Svelte |\n';
	report += '| --- | --- | --- | --- | --- |\n';
	for (const testName of domTestNames) {
		report += `| ${testName} | ${formatStat(results.dom.dothtml[testName].median)}ms | ${formatStat(results.dom.react[testName].median)}ms | ${formatStat(results.dom.vue[testName].median)}ms | ${formatStat(results.dom.svelte[testName].median)}ms |\n`;
	}

	report += '\n## Reactive Styling Performance (Median ms)\n\n';
	report += '| Test | DOThtml | React | Vue | Svelte |\n';
	report += '| --- | --- | --- | --- | --- |\n';
	for (const testName of stylingTestNames) {
		report += `| ${testName} | ${formatStat(results.styling.dothtml[testName].median)}ms | ${formatStat(results.styling.react[testName].median)}ms | ${formatStat(results.styling.vue[testName].median)}ms | ${formatStat(results.styling.svelte[testName].median)}ms |\n`;
	}

	report += '\n## Detailed Statistics\n\n';
	for (const section of [
		{ title: 'Cold Start', data: results.coldStart, tests: coldStartTestNames },
		{ title: 'DOM Operations', data: results.dom, tests: domTestNames },
		{ title: 'Styling', data: results.styling, tests: stylingTestNames }
	]) {
		report += `### ${section.title}\n\n`;
		for (const testName of section.tests) {
			report += `#### ${testName}\n\n`;
			report += '| Framework | Mean | Median | Std Dev | Min | Max |\n';
			report += '| --- | --- | --- | --- | --- | --- |\n';
			for (const framework of Object.keys(section.data)) {
				const stats = section.data[framework][testName];
				report += `| ${framework} | ${formatStat(stats.mean)}ms | ${formatStat(stats.median)}ms | ${formatStat(stats.stddev)}ms | ${formatStat(stats.min)}ms | ${formatStat(stats.max)}ms |\n`;
			}
			report += '\n';
		}
	}

	return report;
}

async function runSingleSuite(port, config) {
	const browser = await chromium.launch();
	const frameworks = ['dothtml', 'react', 'vue', 'svelte'];
	const coldStart = {};
	const dom = {};
	const styling = {};

	try {
		for (const framework of frameworks) {
			console.log(`Benchmarking ${framework} (Cold Start)...`);
			const page = await browser.newPage();
			const url = `http://localhost:${port}/${framework}/index.html`;
			coldStart[framework] = await runColdStartBenchmarks(page, url, config);
			await page.close();
		}

		for (const framework of frameworks) {
			console.log(`Benchmarking ${framework} (DOM)...`);
			const page = await browser.newPage();
			page.on('console', msg => console.log(`PAGE LOG [${framework}]:`, msg.text()));
			page.on('pageerror', err => console.error(`PAGE ERROR [${framework}]:`, err.message));
			page.setDefaultTimeout(60000);
			await page.goto(`http://localhost:${port}/${framework}/index.html`, { waitUntil: 'networkidle' });
			dom[framework] = await runDomBenchmarks(page, framework, config);
			await page.close();
		}

		for (const framework of frameworks) {
			console.log(`Benchmarking ${framework} (Styling)...`);
			const page = await browser.newPage();
			await page.goto(`http://localhost:${port}/styling/${framework}/index.html`, { waitUntil: 'networkidle' });
			styling[framework] = await runStylingBenchmarks(page, config);
			await page.close();
		}
	} finally {
		await browser.close();
	}

	return { coldStart, dom, styling };
}

async function runBenchmark() {
	const config = parseArgs();
	console.log(`Benchmark config: iterations=${config.iterations}, warmup=${config.warmup}, suites=${config.suites}`);

	console.log('Building benchmarks...');
	const viteBin = 'vite';
	const build = spawn(viteBin, ['build'], { cwd: __dirname, shell: true });
	await new Promise((resolve, reject) => {
		build.on('close', code => code === 0 ? resolve() : reject(new Error('Build failed')));
	});

	console.log('Starting Vite preview server...');
	const vite = spawn(viteBin, ['preview'], { cwd: __dirname, detached: true, shell: true });

	try {
		let port = 4173;
		await new Promise((resolve, reject) => {
			vite.stdout.on('data', data => {
				const output = data.toString();
				console.log('Vite:', output);
				const match = output.match(/http:\/\/localhost:(\d+)\//);
				if (match) {
					port = match[1];
					resolve();
				}
			});
			vite.stderr.on('data', data => {
				console.error('Vite Error:', data.toString());
			});
			vite.on('error', reject);
			vite.on('close', (code) => {
				if (code !== null && code !== 0) reject(new Error(`Vite exited with code ${code}`));
			});
		});

		const suiteRuns = [];
		for (let suite = 0; suite < config.suites; suite++) {
			if (config.suites > 1) {
				console.log(`\nSuite ${suite + 1}/${config.suites}...`);
			}
			suiteRuns.push(await runSingleSuite(port, config));
		}

		const results = config.suites === 1
			? { coldStart: suiteRuns[0].coldStart, dom: suiteRuns[0].dom, styling: suiteRuns[0].styling }
			: combineSuiteResults(suiteRuns);

		const coldStartTestNames = Object.keys(results.coldStart.dothtml);
		const domTestNames = Object.keys(results.dom.dothtml);
		const stylingTestNames = Object.keys(results.styling.dothtml);

		console.log('\nCold Start Benchmark Results (Median ms):');
		console.table(buildSummaryTable(results.coldStart, coldStartTestNames));
		console.log('\nDOM Benchmark Results (Median ms):');
		console.table(buildSummaryTable(results.dom, domTestNames));
		console.log('\nStyling Benchmark Results (Median ms):');
		console.table(buildSummaryTable(results.styling, stylingTestNames));

		console.log('\nDetailed statistics (median / std dev):');
		for (const testName of domTestNames) {
			console.log(`\n  ${testName}:`);
			for (const framework of Object.keys(results.dom)) {
				const stats = results.dom[framework][testName];
				console.log(`    ${framework}: median ${formatStat(stats.median)}ms, stddev ${formatStat(stats.stddev)}ms`);
			}
		}

		const fs = await import('fs');
		const report = writeReport(config, results);
		fs.writeFileSync(path.join(__dirname, 'results.md'), report);
		console.log('\nReport generated: benchmarks/results.md');
	} finally {
		if (vite.pid) {
			try {
				process.kill(-vite.pid);
			} catch (e) {
				vite.kill();
			}
		}
		// Give it a moment to die
		await new Promise(resolve => setTimeout(resolve, 500));
	}
	process.exit(0);
}

runBenchmark().catch(err => {
	console.error(err);
	process.exit(1);
});
