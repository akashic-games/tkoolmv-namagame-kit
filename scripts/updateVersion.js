const fs = require("fs");
const path = require("path");
const execCommand = require("./util/execCommand");

if (process.argv.length < 2 || !/^(major|minor|patch)$/.test(process.argv[2])) {
    console.error("Please Run this script as follows:\nnode scripts/updateVersion.js major|minor|patch");
    process.exit(1);
}

const target = process.argv[2];

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
* [@akashic/tkoolmv-namagame-converter@${converterVersion}](https://github.com/akashic-games/tkoolmv-namagame-converter/releases/tag/v${converterVersion})
* [@akashic/tkoolmv-namagame-runtime@${runtimeVersion}](https://github.com/akashic-games/tkoolmv-namagame-runtime/releases/tag/v${runtimeVersion})`;
fs.writeFileSync(changelogPath, changelog.replace("# CHANGELOG", content));
// github に反映
execCommand("git add CHANGELOG.md");
execCommand(`git commit -m "Update Kit to v${version}"`);
execCommand("git push origin main");
