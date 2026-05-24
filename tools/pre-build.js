const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOTHTML_PKG_PATH = path.join(ROOT, 'packages/dothtml/package.json');
const DOTHTML_VERSION_TS_PATH = path.join(ROOT, 'packages/dothtml/src/version.ts');
const INTERFACES_VERSION_TS_PATH = path.join(ROOT, 'packages/interfaces/src/version.ts');
const WEBSITE_VERSION_TS_PATH = path.join(ROOT, 'dothtml.org/src/generated/version.ts');

console.log('--- Pre-build: Syncing Version ---');

// 1. Get Version from package.json
let version = 'unknown';
if (fs.existsSync(DOTHTML_PKG_PATH)) {
	const pkg = JSON.parse(fs.readFileSync(DOTHTML_PKG_PATH, 'utf8'));
	version = pkg.version;
	console.log(`Version: ${version}`);
} else {
	console.error(`Error: ${DOTHTML_PKG_PATH} not found.`);
	process.exit(1);
}

// 2. Generate version.ts for the library
fs.writeFileSync(DOTHTML_VERSION_TS_PATH, `/* GENERATED CONTENT */\nexport const VERSION = "${version}" as const;\n`);
console.log(`Generated ${DOTHTML_VERSION_TS_PATH}`);

// 3. Generate version.ts for the interfaces (for typed version)
fs.writeFileSync(INTERFACES_VERSION_TS_PATH, `/* GENERATED CONTENT */\nexport const VERSION = "${version}" as const;\n`);
console.log(`Generated ${INTERFACES_VERSION_TS_PATH}`);

// 4. Generate version.ts for the website (maintaining compatibility)
const websiteGenDir = path.dirname(WEBSITE_VERSION_TS_PATH);
if (!fs.existsSync(websiteGenDir)) fs.mkdirSync(websiteGenDir, { recursive: true });
fs.writeFileSync(WEBSITE_VERSION_TS_PATH, `/* GENERATED CONTENT */\nexport const DOTHTML_VERSION = "${version}" as const;\n`);
console.log(`Generated ${WEBSITE_VERSION_TS_PATH}`);
