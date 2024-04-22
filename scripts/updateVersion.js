const fs = require("fs");
const path = require("path");
const sh = require("shelljs");

const target = process.argv.length >= 2 ? process.argv[2] : "patch";

execCommand("git checkout main");
// バージョン更新
execCommand(`npm version ${target}`);
// CHANGELOG 更新
const changelogPath = path.resolve(__dirname, "..", "CHANGELOG.md");
const changelog = fs.readFileSync(changelogPath).toString();
const packageJson = require(path.resolve(__dirname, "..", "package.json"));
const version = packageJson["version"];
const converterPackageJson = require(path.resolve(__dirname, "..", "module", "tkoolmv-namagame-converter", "package.json"));
const converterVersion = converterPackageJson["version"];
const runtimeVersion = execCommand("npm info @akashic/tkoolmv-namagame-runtime@latest version");
const content = `# CHANGELOG

## ${version}
* @akashic/tkoolmv-namagame-converter@${converterVersion}
* @akashic/tkoolmv-namagame-runtime@${runtimeVersion}`;
fs.writeFileSync(changelogPath, changelog.replace("# CHANGELOG", content));
// github に反映
execCommand("git add CHANGELOG.md");
execCommand(`git commit -m "Update Kit to v${version}"`);
execCommand("git push origin main");

function execCommand(command) {
	const result = sh.exec(command);
	if (result.code !== 0) {
		console.error(result.stderr);
		process.exit(1);
	}
	return result.stdout.trim();
}
