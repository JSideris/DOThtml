const fs = require('fs');
const path = require('path');

// 1. Get the current sizes from the generated file
const sizeTsPath = path.join(__dirname, '../dothtml.org/src/generated/size.ts');
let SIZE = 'unknown';
let SIZE_FULL = 'unknown';

if (fs.existsSync(sizeTsPath)) {
	const sizeTsContent = fs.readFileSync(sizeTsPath, 'utf8');
	const sizeMatch = sizeTsContent.match(/DOTHTML_COMPRESSED_SIZE = ([\d.]+)/);
	const sizeFullMatch = sizeTsContent.match(/DOTHTML_COMPRESSED_SIZE_FULL = ([\d.]+)/);

	if (sizeMatch) SIZE = sizeMatch[1];
	if (sizeFullMatch) SIZE_FULL = sizeFullMatch[1];
} else {
	console.warn(`Warning: ${sizeTsPath} not found. Using 'unknown' for sizes.`);
}

// 2. Parse benchmark results
const benchResultsPath = path.join(__dirname, '../benchmarks/results.md');
const benchTsPath = path.join(__dirname, '../dothtml.org/src/generated/benchmarks.ts');
const benchMap = {};
const rawBenchData = {};

if (fs.existsSync(benchResultsPath)) {
	const benchContent = fs.readFileSync(benchResultsPath, 'utf8');
	
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

	// Parse tables
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
					const value = cells[index + 1]; // DOThtml is at index 1, React at 2, etc.
					if (value) {
						const numValue = parseFloat(value.replace('ms', ''));
						testValues.push({ fw, numValue, originalValue: value });
						rawBenchData[testKey][fw.toUpperCase()] = numValue;
					}
				});

				const minVal = Math.min(...testValues.map(v => v.numValue));

				testValues.forEach(({ fw, numValue, originalValue }) => {
					// value is like "6.88ms", we want "6.88 ms" for docs
					let formattedValue = originalValue.replace('ms', ' ms');
					if (numValue === minVal) {
						formattedValue = `**${formattedValue}**`;
					}
					benchMap[`BENCH_${testKey}_${fw.toUpperCase()}`] = formattedValue;
				});
			}
		}
	});

	// Generate TS file for the website
	const benchTsContent = `/* GENERATED CONTENT */
export const BENCHMARK_DATA = ${JSON.stringify(rawBenchData, null, 2)};
`;
	const benchTsDir = path.dirname(benchTsPath);
	if (!fs.existsSync(benchTsDir)) {
		fs.mkdirSync(benchTsDir, { recursive: true });
	}
	fs.writeFileSync(benchTsPath, benchTsContent);
	console.log(`Generated ${benchTsPath}`);

} else {
	console.warn(`Warning: ${benchResultsPath} not found. Benchmark placeholders will be replaced with 'N/A'.`);
}

const srcDir = path.join(__dirname, '../docs');
const distDir = path.join(__dirname, '../dothtml.org/public/docs');
const llmsFullFile = path.join(__dirname, '../dothtml.org/public/llms-full.txt');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
	fs.mkdirSync(distDir, { recursive: true });
}

if (!fs.existsSync(srcDir)) {
	console.error(`Error: Source directory ${srcDir} does not exist.`);
	process.exit(1);
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.md'));
const EXCLUDE_FROM_LLM = ['hero-features.md', 'learn-more.md'];
let fullContent = "# DOThtml Full Documentation\n\n> This file contains the complete documentation for DOThtml, concatenated for easy ingestion by LLMs.\n\n";

// Sort files to ensure consistent order in llms-full.txt
files.sort().forEach(file => {
	let content = fs.readFileSync(path.join(srcDir, file), 'utf8');
	
	// Replace size placeholders
	content = content.replace(/%%DOTHTML_COMPRESSED_SIZE%%/g, SIZE);
	content = content.replace(/%%DOTHTML_COMPRESSED_SIZE_FULL%%/g, SIZE_FULL);
	
	// Replace benchmark placeholders
	Object.keys(benchMap).forEach(key => {
		const regex = new RegExp(`%%${key}%%`, 'g');
		content = content.replace(regex, benchMap[key]);
	});

	// Replace any remaining benchmark placeholders with N/A
	content = content.replace(/%%BENCH_[A-Z0-9_]+%%/g, 'N/A');
	
	// Save individual "compiled" file
	const cleanContent = content.replace(/<!--\s*llm-exclude-(start|end)\s*-->/g, '');
	fs.writeFileSync(path.join(distDir, file), cleanContent);
	
	// Add to the "Big File"
	if (!EXCLUDE_FROM_LLM.includes(file)) {
		// Surgical stripping for LLM output
		const llmContent = content.replace(/<!-- llm-exclude-start -->[\s\S]*?<!-- llm-exclude-end -->/g, '').trim();
		
		const title = file.replace('.md', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		fullContent += `\n\n--- FILE: ${file} (${title}) ---\n\n` + llmContent;
	}
});

// Save the concatenated file
fs.writeFileSync(llmsFullFile, fullContent);
console.log(`Processed ${files.length} docs and generated ${llmsFullFile}`);
