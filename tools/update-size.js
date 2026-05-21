const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BUNDLE_PATH = path.join(__dirname, '../packages/dothtml/dist/index.global.js');
const SIZE_TS_PATH = path.join(__dirname, '../dothtml.org/src/generated/size.ts');
const README_PATH = path.join(__dirname, '../readme.md');

function getBrotliSize(filePath) {
	if (!fs.existsSync(filePath)) {
		console.error(`Bundle not found at ${filePath}. Run build first.`);
		process.exit(1);
	}
	const content = fs.readFileSync(filePath);
	const compressed = zlib.brotliCompressSync(content);
	return compressed.length;
}

try {
	const sizeBytes = getBrotliSize(BUNDLE_PATH);
	const sizeKb = (sizeBytes / 1024).toFixed(1);
	const sizeKbFull = (sizeBytes / 1024).toFixed(2);

	// 1. Generate the TS constant for the website
	const sizeTsContent = `/* GENERATED CONTENT */
export const DOTHTML_COMPRESSED_SIZE = ${sizeKb};
export const DOTHTML_COMPRESSED_SIZE_FULL = ${sizeKbFull};
`;

	const sizeTsDir = path.dirname(SIZE_TS_PATH);
	if (!fs.existsSync(sizeTsDir)) {
		fs.mkdirSync(sizeTsDir, { recursive: true });
	}
	fs.writeFileSync(SIZE_TS_PATH, sizeTsContent);
	console.log(`Generated ${SIZE_TS_PATH}`);

	// 2. Update readme.md directly
	if (fs.existsSync(README_PATH)) {
		let readme = fs.readFileSync(README_PATH, 'utf8');
		// Match the DOThtml line in the performance table
		// Example: | **DOThtml** | **~660ms** | **18.6kB** |
		const readmeRegex = /(\| \*\*DOThtml\*\* \| .*? \| \*\*)\d+\.?\d*kB(\*\* \|)/;
		if (readmeRegex.test(readme)) {
			readme = readme.replace(readmeRegex, `$1${sizeKb}kB$2`);
			fs.writeFileSync(README_PATH, readme);
			console.log(`Updated ${README_PATH}`);
		} else {
			console.warn(`Could not find DOThtml size pattern in ${README_PATH}`);
		}
	}

	console.log(`Successfully updated DOThtml size to ${sizeKb} kB (${sizeKbFull} kB)`);
} catch (err) {
	console.error('Error updating size:', err);
	process.exit(1);
}
