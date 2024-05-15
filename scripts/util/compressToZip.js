const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// 指定されたディレクトリ(zipDirPath)を指定されたパス(zipPath)でzip圧縮する関数
async function compressToZip(zipDirPath, zipPath) {
	const ostream = fs.createWriteStream(zipPath);
	// zip圧縮完了の通知が来るまで待機するための処理
	const streamClosePromise = new Promise(resolve => ostream.on("close", resolve));
	const archive = archiver("zip");
	archive.pipe(ostream);
	archive.glob(`${path.basename(zipDirPath)}/**`, {cwd: path.relative(process.cwd(), path.dirname(zipDirPath))});
	await archive.finalize();
	// zipが不完全な状態でアップロードされるのを防ぐために、zip圧縮完了の通知が来るまで待機
	await streamClosePromise;
	console.log(`Completed: ${zipPath}`);
}

module.exports = compressToZip;
