const path = require("path");
const sh = require("shelljs");

const converterPath = path.resolve(__dirname, "..", "module", "tkoolmv-namagame-converter");
execCommand(`cd ${converterPath} && git checkout main && git pull origin`);
execCommand("git add module/tkoolmv-namagame-converter");
execCommand("git commit -m \"update tkoolmv-namagame-converter\"");

function execCommand(command) {
	const result = sh.exec(command);
	if (result.code !== 0) {
		console.error(result.stderr);
		process.exit(1);
	}
	return result.stdout.trim();
}
