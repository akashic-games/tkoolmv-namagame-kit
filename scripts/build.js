const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const marked = require("marked");

const distDirPath = path.resolve(__dirname, "../dist");
if (fs.existsSync(distDirPath)) {
	shell.rm("-rf", distDirPath);
}
shell.mkdir(distDirPath);

const staticDirPath = path.resolve(__dirname, "../static");
const runtimeDirPath = path.resolve(__dirname, "../runtime");
const scriptDirPath = path.join(runtimeDirPath, "script");
const pluginsDirPath = path.resolve(__dirname, "../plugins");
const tkoolmvKitDirPath = path.join(distDirPath, "tkoolmv-namagame-kit");
const gameDirPath = path.join(tkoolmvKitDirPath, "game");
const gameJsonHelperSrcDirPath = path.resolve(__dirname, "../gamejson-helper");
const gameJsonHelperDirPath = path.join(distDirPath, path.basename(gameJsonHelperSrcDirPath));

// tkoolmv-namagame-kitディレクトリにファイル・ディレクトリ配置
shell.mkdir(tkoolmvKitDirPath);
shell.cp("-Rf", pluginsDirPath, tkoolmvKitDirPath);
fs.writeFileSync(path.join(tkoolmvKitDirPath, "README.html"), marked.marked(fs.readFileSync(path.join(staticDirPath, "README.md")).toString()));
shell.mkdir(gameDirPath);
["assets", "text", "game.json"].forEach(f => shell.cp("-Rf", path.join(staticDirPath, f), gameDirPath));
shell.cp("-Rf", scriptDirPath, gameDirPath);
// 外部モジュールのコピー
const gameJson = require(path.join(gameDirPath, "game.json"));
(gameJson["globalScripts"] ?? []).forEach(scriptPath => {
	const dirPath = path.join(gameDirPath, path.dirname(scriptPath));
	if (!fs.existsSync(dirPath)) {
		shell.mkdir("-p", dirPath);
	}
	shell.cp(path.join(runtimeDirPath, scriptPath), dirPath);
});
shell.exec(`cd ${gameDirPath} && ${path.resolve(__dirname, "../scripts/node_modules/.bin/akashic-cli-scan")} asset`);

// gamejson-helperの成果物を配置
shell.mkdir(gameJsonHelperDirPath);
shell.cp(path.join(gameJsonHelperSrcDirPath, "dist", "*"), gameJsonHelperDirPath);
