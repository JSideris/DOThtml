import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DOM_TESTS = [
	{ id: 'run', name: 'Create 1,000 rows' },
	{ id: 'runlots', name: 'Create 10,000 rows' },
	{ id: 'add', name: 'Append 1,000 rows', setup: 'run' },
	{ id: 'update', name: 'Update every 10th row' },
	{ id: 'swaprows', name: 'Swap Rows' },
	{ id: 'clear', name: 'Clear' }
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
 * timing and rAF wait run in the browser.
 */
async function measureClick(page, buttonId) {
	await page.evaluate(() => { window.__benchStart = performance.now(); });
	await page.click(`#${buttonId}`);
	return page.evaluate(async () => {
		await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
		return performance.now() - window.__benchStart;
	});
}

async function clickAndWait(page, buttonId) {
	await page.click(`#${buttonId}`);
	await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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
		await measureClick(page, test.id);
		await resetAfterTest(page, test.id);
	}

	const samples = [];
	for (let i = 0; i < config.iterations; i++) {
		await setupTest(page, test.setup);
		samples.push(await measureClick(page, test.id));
		await resetAfterTest(page, test.id);
	}

	return summarizeSamples(samples);
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

	for (let i = 0; i < config.warmup; i++) {
		await measureClick(page, buttonId);
	}

	const samples = [];
	for (let i = 0; i < config.iterations; i++) {
		samples.push(await measureClick(page, buttonId));
	}

	return { [testName]: summarizeSamples(samples) };
}

function combineSuiteResults(suiteRuns) {
	const frameworks = Object.keys(suiteRuns[0].dom);
	const combined = { dom: {}, styling: {} };

	for (const framework of frameworks) {
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
			table[framework][testName] = formatStat(results[framework][testName].mean);
		}
	}
	return table;
}

function writeReport(config, results) {
	const domTestNames = Object.keys(results.dom.dothtml);
	const stylingTestNames = Object.keys(results.styling.dothtml);

	let report = '# Framework Benchmark Results\n\n';
	report += `Configuration: ${config.iterations} iterations, ${config.warmup} warmup, ${config.suites} suite(s). Timings measured in-browser with \`performance.now()\`.\n\n`;

	report += '## DOM Operations (Average ms)\n\n';
	report += '| Test | DOThtml | React | Vue | Svelte |\n';
	report += '| --- | --- | --- | --- | --- |\n';
	for (const testName of domTestNames) {
		report += `| ${testName} | ${formatStat(results.dom.dothtml[testName].mean)}ms | ${formatStat(results.dom.react[testName].mean)}ms | ${formatStat(results.dom.vue[testName].mean)}ms | ${formatStat(results.dom.svelte[testName].mean)}ms |\n`;
	}

	report += '\n## Reactive Styling Performance\n\n';
	report += '| Test | DOThtml | React | Vue | Svelte |\n';
	report += '| --- | --- | --- | --- | --- |\n';
	for (const testName of stylingTestNames) {
		report += `| ${testName} | ${formatStat(results.styling.dothtml[testName].mean)}ms | ${formatStat(results.styling.react[testName].mean)}ms | ${formatStat(results.styling.vue[testName].mean)}ms | ${formatStat(results.styling.svelte[testName].mean)}ms |\n`;
	}

	report += '\n## Detailed Statistics\n\n';
	for (const section of [
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
	const dom = {};
	const styling = {};

	try {
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

	return { dom, styling };
}

async function runBenchmark() {
	const config = parseArgs();
	console.log(`Benchmark config: iterations=${config.iterations}, warmup=${config.warmup}, suites=${config.suites}`);

	console.log('Building benchmarks...');
	const build = spawn('npx', ['vite', 'build'], { cwd: __dirname });
	await new Promise((resolve, reject) => {
		build.on('close', code => code === 0 ? resolve() : reject(new Error('Build failed')));
	});

	console.log('Starting Vite preview server...');
	const vite = spawn('npx', ['vite', 'preview'], { cwd: __dirname });

	let port = 4173;
	await new Promise(resolve => {
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
	});

	const suiteRuns = [];
	for (let suite = 0; suite < config.suites; suite++) {
		if (config.suites > 1) {
			console.log(`\nSuite ${suite + 1}/${config.suites}...`);
		}
		suiteRuns.push(await runSingleSuite(port, config));
	}

	vite.kill();

	const results = config.suites === 1
		? { dom: suiteRuns[0].dom, styling: suiteRuns[0].styling }
		: combineSuiteResults(suiteRuns);

	const domTestNames = Object.keys(results.dom.dothtml);
	const stylingTestNames = Object.keys(results.styling.dothtml);

	console.log('\nDOM Benchmark Results (Average ms):');
	console.table(buildSummaryTable(results.dom, domTestNames));
	console.log('\nStyling Benchmark Results (Average ms):');
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
}

runBenchmark().catch(err => {
	console.error(err);
	process.exit(1);
});
