const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Paths
const ROOT = path.join(__dirname, '..');
const DOTHTML_PKG_PATH = path.join(ROOT, 'packages/dothtml/package.json');
const BUNDLE_PATH = path.join(ROOT, 'packages/dothtml/dist/index.global.js');
const README_PATH = path.join(ROOT, 'readme.md');
const BENCH_RESULTS_PATH = path.join(ROOT, 'benchmarks/results.md');
const DOCS_SRC_DIR = path.join(ROOT, 'docs');

const GEN_DIR = path.join(ROOT, 'dothtml.org/src/generated');
const SIZE_TS_PATH = path.join(GEN_DIR, 'size.ts');
const BENCH_TS_PATH = path.join(GEN_DIR, 'benchmarks.ts');

const PUBLIC_DOCS_DIR = path.join(ROOT, 'dothtml.org/public/docs');
const LLMS_FULL_FILE = path.join(ROOT, 'dothtml.org/public/llms-full.txt');

// 1. Get Version
console.log('--- 1. Extracting Version ---');
let version = 'unknown';
if (fs.existsSync(DOTHTML_PKG_PATH)) {
	const pkg = JSON.parse(fs.readFileSync(DOTHTML_PKG_PATH, 'utf8'));
	version = pkg.version;
	console.log(`Version: ${version}`);
} else {
	console.error(`Error: ${DOTHTML_PKG_PATH} not found.`);
	process.exit(1);
}

// 2. Calculate Size
console.log('\n--- 2. Calculating Bundle Size ---');
function getBrotliSize(filePath) {
	if (!fs.existsSync(filePath)) {
		console.error(`Bundle not found at ${filePath}. Run build first.`);
		process.exit(1);
	}
	const content = fs.readFileSync(filePath);
	const compressed = zlib.brotliCompressSync(content);
	return compressed.length;
}

const sizeBytes = getBrotliSize(BUNDLE_PATH);
const sizeKb = (sizeBytes / 1024).toFixed(1);
const sizeKbFull = (sizeBytes / 1024).toFixed(2);
console.log(`Size: ${sizeKb} kB (${sizeKbFull} kB)`);

// 3. Generate TS Constants
console.log('\n--- 3. Generating TS Constants ---');
if (!fs.existsSync(GEN_DIR)) {
	fs.mkdirSync(GEN_DIR, { recursive: true });
}

const sizeTsContent = `/* GENERATED CONTENT */
export const DOTHTML_COMPRESSED_SIZE = ${sizeKb};
export const DOTHTML_COMPRESSED_SIZE_FULL = ${sizeKbFull};
`;
fs.writeFileSync(SIZE_TS_PATH, sizeTsContent);
console.log(`Generated ${SIZE_TS_PATH}`);

// 4. Update README.md
console.log('\n--- 4. Updating README.md ---');
if (fs.existsSync(README_PATH)) {
	let readme = fs.readFileSync(README_PATH, 'utf8');
	readme = readme.replace(/%%DOTHTML_COMPRESSED_SIZE%%/g, sizeKb);
	readme = readme.replace(/%%DOTHTML_VERSION%%/g, version);
	fs.writeFileSync(README_PATH, readme);
	console.log(`Updated ${README_PATH}`);
}

// 5. Parse Benchmarks
console.log('\n--- 5. Parsing Benchmarks ---');
const benchMap = {};
const rawBenchData = {};

if (fs.existsSync(BENCH_RESULTS_PATH)) {
	const benchContent = fs.readFileSync(BENCH_RESULTS_PATH, 'utf8');
	
	const testMapping = {
		'First Contentful Paint': 'FCP',
		'DOM Interactive': 'DOM_INTERACTIVE',
		'Framework Ready': 'FRAMEWORK_READY',
		'Create 1,000 rows': 'CREATE_1000',
		'Create 10,000 rows': 'CREATE_10000',
		'Append 1,000 rows': 'APPEND_1000',
		'Update every 10th row': 'UPDATE_10TH',
		'Swap Rows': 'SWAP_ROWS',
		'Clear': 'CLEAR',
		'Bulk Style Update': 'BULK_STYLE'
	};

	const frameworks = ['DOThtml', 'React', 'Vue', 'Svelte'];

	const lines = benchContent.split('\n');
	lines.forEach(line => {
		if (line.includes('|') && !line.includes('---')) {
			const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');
			const testName = cells[0];
			if (testMapping[testName]) {
				const testKey = testMapping[testName];
				rawBenchData[testKey] = {};
				
				const testValues = [];
				frameworks.forEach((fw, index) => {
					const value = cells[index + 1];
					if (value) {
						const numValue = parseFloat(value.replace('ms', ''));
						testValues.push({ fw, numValue, originalValue: value });
						rawBenchData[testKey][fw.toUpperCase()] = numValue;
					}
				});

				const minVal = Math.min(...testValues.map(v => v.numValue));

				testValues.forEach(({ fw, numValue, originalValue }) => {
					let formattedValue = originalValue.replace('ms', ' ms');
					if (numValue === minVal) {
						formattedValue = `**${formattedValue}**`;
					}
					benchMap[`BENCH_${testKey}_${fw.toUpperCase()}`] = formattedValue;
				});
			}
		}
	});

	const benchTsContent = `/* GENERATED CONTENT */
export const BENCHMARK_DATA = ${JSON.stringify(rawBenchData, null, 2)};
`;
	fs.writeFileSync(BENCH_TS_PATH, benchTsContent);
	console.log(`Generated ${BENCH_TS_PATH}`);

} else {
	console.warn(`Warning: ${BENCH_RESULTS_PATH} not found. Benchmark placeholders will be replaced with 'N/A'.`);
}

// 6. Process Documentation
console.log('\n--- 6. Processing Documentation ---');
if (!fs.existsSync(PUBLIC_DOCS_DIR)) {
	fs.mkdirSync(PUBLIC_DOCS_DIR, { recursive: true });
}

if (!fs.existsSync(DOCS_SRC_DIR)) {
	console.error(`Error: Source directory ${DOCS_SRC_DIR} does not exist.`);
	process.exit(1);
}

const files = fs.readdirSync(DOCS_SRC_DIR).filter(f => f.endsWith('.md'));
const EXCLUDE_FROM_LLM = ['hero-features.md', 'learn-more.md'];
let fullContent = "# DOThtml Full Documentation\n\n> This file contains the complete documentation for DOThtml, concatenated for easy ingestion by LLMs.\n\n";

files.sort().forEach(file => {
	let content = fs.readFileSync(path.join(DOCS_SRC_DIR, file), 'utf8');
	
	// Replace placeholders
	content = content.replace(/%%DOTHTML_COMPRESSED_SIZE%%/g, sizeKb);
	content = content.replace(/%%DOTHTML_COMPRESSED_SIZE_FULL%%/g, sizeKbFull);
	content = content.replace(/%%DOTHTML_VERSION%%/g, version);
	
	Object.keys(benchMap).forEach(key => {
		const regex = new RegExp(`%%${key}%%`, 'g');
		content = content.replace(regex, benchMap[key]);
	});

	content = content.replace(/%%BENCH_[A-Z0-9_]+%%/g, 'N/A');
	
	// Save individual "compiled" file
	const cleanContent = content.replace(/<!--\s*llm-exclude-(start|end)\s*-->/g, '');
	fs.writeFileSync(path.join(PUBLIC_DOCS_DIR, file), cleanContent);
	
	// Add to the LLM full file
	if (!EXCLUDE_FROM_LLM.includes(file)) {
		const llmContent = content.replace(/<!-- llm-exclude-start -->[\s\S]*?<!-- llm-exclude-end -->/g, '').trim();
		const title = file.replace('.md', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		fullContent += `\n\n--- FILE: ${file} (${title}) ---\n\n` + llmContent;
	}
});

	fs.writeFileSync(LLMS_FULL_FILE, fullContent);
	console.log(`Processed ${files.length} docs and generated ${LLMS_FULL_FILE}`);

// 7. Update create-dothtml templates
console.log('\n--- 7. Updating create-dothtml templates ---');
const CREATE_DOTHTML_TEMPLATES_DIR = path.join(ROOT, 'packages/create-dothtml/templates');
if (fs.existsSync(CREATE_DOTHTML_TEMPLATES_DIR)) {
	const templates = fs.readdirSync(CREATE_DOTHTML_TEMPLATES_DIR);
	templates.forEach(template => {
		const pkgPath = path.join(CREATE_DOTHTML_TEMPLATES_DIR, template, 'package.json');
		if (fs.existsSync(pkgPath)) {
			const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
			if (pkg.dependencies && pkg.dependencies.dothtml) {
				pkg.dependencies.dothtml = `^${version}`;
				fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
				console.log(`Updated dothtml version to ^${version} in ${pkgPath}`);
			}
		}
	});
}

console.log('\nPost-build script completed successfully!');
