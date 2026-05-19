import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runBenchmark() {
    console.log('Building benchmarks...');
    const build = spawn('npx', ['vite', 'build'], { cwd: __dirname });
    await new Promise((resolve, reject) => {
        build.on('close', code => code === 0 ? resolve() : reject(new Error('Build failed')));
    });

    console.log('Starting Vite preview server...');
    const vite = spawn('npx', ['vite', 'preview'], { cwd: __dirname });

    let port = 4173;
    // Wait for Vite to start
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

    const browser = await chromium.launch();
    const frameworks = ['dothtml', 'react', 'vue', 'svelte'];
    const results = {};
    const stylingResults = {};

    for (const framework of frameworks) {
        console.log(`Benchmarking ${framework} (DOM)...`);
        const page = await browser.newPage();
        page.on('console', msg => console.log(`PAGE LOG [${framework}]:`, msg.text()));
        page.on('pageerror', err => console.error(`PAGE ERROR [${framework}]:`, err.message));
        page.setDefaultTimeout(60000);
        await page.goto(`http://localhost:${port}/${framework}/index.html`, { waitUntil: 'networkidle' });

        results[framework] = {};

        const tests = [
            { id: 'run', name: 'Create 1,000 rows' },
            { id: 'runlots', name: 'Create 10,000 rows' },
            { id: 'add', name: 'Append 1,000 rows' },
            { id: 'update', name: 'Update every 10th row' },
            { id: 'swaprows', name: 'Swap Rows' },
            { id: 'clear', name: 'Clear' }
        ];

        for (const test of tests) {
            // Warm up
            await page.click(`#${test.id}`);
            await page.click('#clear');

            let totalDuration = 0;
            const iterations = 5;

            for (let i = 0; i < iterations; i++) {
                const start = Date.now();
                await page.click(`#${test.id}`);
                // Wait for the next frame to ensure rendering is done
                await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0))));
                totalDuration += (Date.now() - start);
                
                if (test.id !== 'clear') await page.click('#clear');
            }

            results[framework][test.name] = (totalDuration / iterations).toFixed(2);
        }

        await page.close();
    }

    // Styling Benchmarks
    for (const framework of frameworks) {
        console.log(`Benchmarking ${framework} (Styling)...`);
        const page = await browser.newPage();
        await page.goto(`http://localhost:${port}/styling/${framework}/index.html`, { waitUntil: 'networkidle' });

        stylingResults[framework] = {};

        // 1. Bulk Update Test
        let totalUpdateDuration = 0;
        for (let i = 0; i < 5; i++) {
            const start = Date.now();
            await page.click('#update-styles');
            await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0))));
            totalUpdateDuration += (Date.now() - start);
        }
        stylingResults[framework]['Bulk Style Update'] = (totalUpdateDuration / 5).toFixed(2);

        await page.close();
    }

    await browser.close();
    vite.kill();

    console.log('\nDOM Benchmark Results (Average ms):');
    console.table(results);
    console.log('\nStyling Benchmark Results:');
    console.table(stylingResults);

    // Generate Markdown report
    let report = '# Framework Benchmark Results\n\n';
    report += '## DOM Operations (Average ms)\n\n';
    report += '| Test | DOThtml | React | Vue | Svelte |\n';
    report += '| --- | --- | --- | --- | --- |\n';

    const testNames = Object.keys(results['dothtml']);
    for (const testName of testNames) {
        report += `| ${testName} | ${results['dothtml'][testName]}ms | ${results['react'][testName]}ms | ${results['vue'][testName]}ms | ${results['svelte'][testName]}ms |\n`;
    }

    report += '\n## Reactive Styling Performance\n\n';
    report += '| Test | DOThtml | React | Vue | Svelte |\n';
    report += '| --- | --- | --- | --- | --- |\n';
    
    const stylingTestNames = Object.keys(stylingResults['dothtml']);
    for (const testName of stylingTestNames) {
        report += `| ${testName} | ${stylingResults['dothtml'][testName]}ms | ${stylingResults['react'][testName]}ms | ${stylingResults['vue'][testName]}ms | ${stylingResults['svelte'][testName]}ms |\n`;
    }

    const fs = await import('fs');
    fs.writeFileSync(path.join(__dirname, 'results.md'), report);
    console.log('\nReport generated: benchmarks/results.md');
}

runBenchmark().catch(err => {
    console.error(err);
    process.exit(1);
});
