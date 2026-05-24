const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getLocalVersion() {
	const pkgPath = path.join(__dirname, '../packages/dothtml/package.json');
	return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version;
}

function getNpmVersion() {
	try {
		return execSync('npm view dothtml version', { encoding: 'utf8' }).trim();
	} catch (e) {
		// If the package doesn't exist on NPM yet or there's a network error, 
		// we return a version that will trigger a bump.
		return '0.0.0';
	}
}

const local = getLocalVersion();
const remote = getNpmVersion();

console.log(`Local version: ${local}`);
console.log(`NPM version:   ${remote}`);

if (local === remote) {
	console.log('\nVersions match. Starting full release flow (Changeset + Versioning + Release)...');
	try {
		// 1. Create a changeset (interactive)
		execSync('npx changeset', { stdio: 'inherit' });
		
		// 2. Bump versions
		console.log('\nBumping versions...');
		execSync('npm run version-packages', { stdio: 'inherit' });
	} catch (e) {
		console.error('\nRelease process cancelled or failed during versioning.');
		process.exit(1);
	}
} else {
	console.log('\nLocal version is already ahead of NPM. Skipping version bump and proceeding to release...');
}

// 3. Build and Publish
const MAX_RETRIES = 3;
let attempt = 1;
let success = false;

while (attempt <= MAX_RETRIES && !success) {
	try {
		console.log(`\nStarting build and publish (Attempt ${attempt}/${MAX_RETRIES})...`);
		execSync('npm run release', { stdio: 'inherit' });
		success = true;
		console.log('\nRelease successful!');
	} catch (e) {
		console.error(`\nAttempt ${attempt} failed.`);
		if (attempt < MAX_RETRIES) {
			const delay = 30;
			console.log(`Retrying in ${delay} seconds...`);
			execSync(`sleep ${delay}`);
			attempt++;
		} else {
			console.error('All release attempts failed.');
			process.exit(1);
		}
	}
}
