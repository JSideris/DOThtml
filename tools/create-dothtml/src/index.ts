import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Helper to get __dirname in both CJS and ESM
const getDirname = () => {
	try {
		return __dirname;
	} catch {
		return path.dirname(fileURLToPath(import.meta.url));
	}
};

const cc = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	underscore: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	hidden: "\x1b[8m",

	fgBlack: "\x1b[30m",
	fgRed: "\x1b[31m",
	FgGreen: "\x1b[32m",
	fgYellow: "\x1b[33m",
	fgBlue: "\x1b[34m",
	fgMagenta: "\x1b[35m",
	fgCyan: "\x1b[36m",
	fgWhite: "\x1b[37m",

	fgBrightBlack: "\x1b[90m",
	fgBrightRed: "\x1b[91m",
	FgBrightGreen: "\x1b[92m",
	fgBrightYellow: "\x1b[93m",
	fgBrightBlue: "\x1b[94m",
	fgBrightMagenta: "\x1b[95m",
	fgBrightCyan: "\x1b[96m",
	fgBrightWhite: "\x1b[97m",
}

export async function cli(args: string[]) {
	// The first two args are node and the script path.
	// We want to support: npx create-dothtml my-app
	// or: npx create-dothtml init my-app
	
	let projectName = args[2];
	let startIndex = 2;

	if (projectName === "init") {
		projectName = args[3];
		startIndex = 3;
	}

	if (!projectName || projectName === "--help" || projectName === "-h") {
		printUsage();
		return;
	}

	const targetDir = path.resolve(process.cwd(), projectName);
	if (fs.existsSync(targetDir)) {
		printError(`Directory "${projectName}" already exists.`);
		return;
	}

	console.log(`\nCreating a new DOThtml app in ${cc.fgBrightBlue}${targetDir}${cc.reset}...`);

	// Template selection (default to TS)
	const argsList = args.slice(startIndex);
	const isJs = argsList.includes("--js");
	const noLint = argsList.includes("--no-lint");
	const template = isJs ? "vanilla-js" : "vanilla-ts";
	
	const currentDir = getDirname();
	// When running from dist/index.js, templates is at ../templates
	let templateDir = path.resolve(currentDir, "..", "templates", template);

	if (!fs.existsSync(templateDir)) {
		// Fallback for development if running directly from src
		templateDir = path.resolve(currentDir, "templates", template);
		if (!fs.existsSync(templateDir)) {
			// Another fallback for how tsup might bundle it
			templateDir = path.resolve(process.cwd(), "templates", template);
			if (!fs.existsSync(templateDir)) {
				printError(`Template directory not found. Tried:\n- ${path.resolve(currentDir, "..", "templates", template)}\n- ${path.resolve(currentDir, "templates", template)}`);
				return;
			}
		}
	}

	try {
		// Copy template
		fs.mkdirSync(targetDir, { recursive: true });
		// @ts-ignore - cpSync is available in Node 16.7.0+
		fs.cpSync(templateDir, targetDir, { recursive: true });

		// Replace placeholders in package.json and index.html
		const filesToProcess = ["package.json", "index.html"];
		for (const file of filesToProcess) {
			const filePath = path.join(targetDir, file);
			if (fs.existsSync(filePath)) {
				let content = fs.readFileSync(filePath, "utf-8");
				content = content.replace(/{{name}}/g, projectName);

				if (file === "package.json" && noLint) {
					const pkg = JSON.parse(content);
					delete pkg.scripts.lint;
					if (pkg.devDependencies) {
						delete pkg.devDependencies.eslint;
						delete pkg.devDependencies["@eslint/js"];
						delete pkg.devDependencies["typescript-eslint"];
					}
					content = JSON.stringify(pkg, null, 2);
				}

				fs.writeFileSync(filePath, content);
			}
		}

		if (noLint) {
			const eslintConfigPath = path.join(targetDir, "eslint.config.js");
			if (fs.existsSync(eslintConfigPath)) {
				fs.unlinkSync(eslintConfigPath);
			}
		}

		console.log(`\n${cc.FgGreen}Success!${cc.reset} Created ${projectName} at ${targetDir}`);
		console.log(`Inside that directory, you can run several commands:`);
		console.log(`\n  ${cc.fgBrightBlue}npm install${cc.reset}`);
		console.log(`    Installs the dependencies.`);
		console.log(`\n  ${cc.fgBrightBlue}npm run dev${cc.reset}`);
		console.log(`    Starts the development server.`);
		console.log(`\n  ${cc.fgBrightBlue}npm run build${cc.reset}`);
		console.log(`    Bundles the app into static files for production.`);

		if (!noLint) {
			console.log(`\n  ${cc.fgBrightBlue}npm run lint${cc.reset}`);
			console.log(`    Checks the code for potential errors.`);
		}

		console.log(`\nWe suggest that you begin by typing:`);
		console.log(`\n  ${cc.fgBrightBlue}cd${cc.reset} ${projectName}`);
		console.log(`  ${cc.fgBrightBlue}npm install${cc.reset}`);
		console.log(`  ${cc.fgBrightBlue}npm run dev${cc.reset}\n`);

	} catch (err: any) {
		printError(`Error creating project: ${err.message}`);
	}
}

function printUsage() {
	console.log(`\n${cc.fgBrightBlue}create-dothtml${cc.reset}`);
	console.log(`The official project initializer for DOThtml.\n`);
	console.log(`${cc.bright}USAGE${cc.reset}`);
	console.log(`  npx create-dothtml ${cc.fgBrightWhite}<project-name>${cc.reset} [options]\n`);
	console.log(`${cc.bright}OPTIONS${cc.reset}`);
	console.log(`  --js       Use JavaScript instead of TypeScript (default)`);
	console.log(`  --no-lint  Skip adding ESLint to the project`);
	console.log(`  --help     Show this help message\n`);
}

function printError(msg: string) {
	console.error(`${cc.fgRed}Error: ${msg}${cc.reset}`);
}
