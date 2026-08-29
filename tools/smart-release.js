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

function printNextSteps(version) {
	console.log('\nVersion bump is ready. Publishing happens in GitHub Actions.');
	console.log('Commit the version and changelog updates, then push to master:');
	console.log('');
	console.log('  git add -A');
	console.log(`  git commit -m "Release ${version}"`);
	console.log('  git push origin master');
	console.log('');
	console.log('The Publish workflow will build and upload packages to npm.');
}

const local = getLocalVersion();
const remote = getNpmVersion();

console.log(`Local version: ${local}`);
console.log(`NPM version:   ${remote}`);

if (local === remote) {
	console.log('\nVersions match. Starting changeset + version bump...');
	try {
		execSync('npx changeset', { stdio: 'inherit' });

		console.log('\nBumping versions...');
		execSync('npm run version-packages', { stdio: 'inherit' });
	} catch (e) {
		console.error('\nRelease process cancelled or failed during versioning.');
		process.exit(1);
	}

	printNextSteps(getLocalVersion());
} else {
	console.log('\nLocal version is already ahead of NPM. No bump needed.');
	printNextSteps(local);
}
