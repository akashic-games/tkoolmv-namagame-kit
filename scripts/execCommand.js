const sh = require("shelljs");

export function execCommand(command) {
	const result = sh.exec(command);
	if (result.code !== 0) {
		console.error(result.stderr);
		process.exit(1);
	}
}
