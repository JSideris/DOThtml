#!/usr/bin/env node
/**
 * Packs the local dothtml and dothtml-interfaces packages, installs them
 * into a fresh consumer fixture, and runs `tsc --noEmit` with skipLibCheck
 * disabled. Catches shipped .d.ts / interface regressions such as TS2344.
 *
 * Expects packages/dothtml/dist to exist (run `npm run build -w dothtml` first).
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const FIXTURE = path.join(__dirname, "consumer-typecheck", "fixture");
const INTERFACES_DIR = path.join(ROOT, "packages", "interfaces");
const DOTHTML_DIR = path.join(ROOT, "packages", "dothtml");
const DIST_JS = path.join(DOTHTML_DIR, "dist", "index.js");
const TSC = path.join(ROOT, "node_modules", "typescript", "bin", "tsc");

function run(cmd, cwd) {
	execSync(cmd, { cwd, stdio: "inherit" });
}

if (!fs.existsSync(DIST_JS)) {
	console.error("dothtml dist is missing. Build first: npm run build -w dothtml");
	process.exit(1);
}
if (!fs.existsSync(TSC)) {
	console.error("TypeScript is not installed in the repo. Run npm ci first.");
	process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dothtml-consumer-typecheck-"));
const packsDir = path.join(tmp, "packs");
const appDir = path.join(tmp, "app");
fs.mkdirSync(packsDir);
fs.mkdirSync(appDir);

try {
	console.log("Packing packages into", packsDir);
	run(`npm pack --pack-destination "${packsDir}"`, INTERFACES_DIR);
	run(`npm pack --pack-destination "${packsDir}"`, DOTHTML_DIR);

	const tarballs = fs.readdirSync(packsDir).filter((f) => f.endsWith(".tgz")).sort();
	if (tarballs.length < 2) {
		throw new Error(`Expected two packed tarballs, found: ${tarballs.join(", ") || "(none)"}`);
	}
	const packArgs = tarballs.map((f) => `"${path.join(packsDir, f)}"`).join(" ");

	for (const name of ["index.ts", "tsconfig.json"]) {
		fs.copyFileSync(path.join(FIXTURE, name), path.join(appDir, name));
	}
	fs.writeFileSync(
		path.join(appDir, "package.json"),
		JSON.stringify({ name: "dothtml-consumer-typecheck", private: true, type: "module" }, null, "\t") + "\n"
	);

	console.log("Installing packed packages into consumer fixture...");
	run(`npm install ${packArgs} --ignore-scripts --no-package-lock --no-fund --no-audit`, appDir);

	console.log("Typechecking consumer (strict, skipLibCheck: false)...");
	run(`"${TSC}" --noEmit --pretty -p "${appDir}/tsconfig.json"`);

	console.log("Consumer typecheck passed.");
} catch (err) {
	console.error("Consumer typecheck failed.");
	console.error("Fixture kept at:", tmp);
	process.exit(err.status || 1);
}

fs.rmSync(tmp, { recursive: true, force: true });
