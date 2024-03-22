const fs = require("fs");
const path = require("path");
const sh = require("shelljs");
const archiver = require("archiver");

const tkoolmvKitDirPath = path.resolve(__dirname, "..", "dist", "tkoolmv-namagame-kit");
const packageJson = require(path.resolve(__dirname, "..", "package.json"));
const version = packageJson["version"];
const tkoolmvKitRuntimeZipPath = path.resolve(__dirname, "..", "dist", `tkoolmv-namagame-kit-runtime-${version}.zip`);

(async() => {
	if (fs.existsSync(tkoolmvKitRuntimeZipPath)) {
		sh.rm("-Rf", tkoolmvKitRuntimeZipPath);
	}
	const ostream = fs.createWriteStream(tkoolmvKitRuntimeZipPath);
	// zip圧縮完了の通知が来るまで待機するための処理
	const streamClosePromise = new Promise(resolve => ostream.on("close", resolve));
	const archive = archiver("zip");
	await archive.pipe(ostream);
	await archive.glob(`${path.basename(tkoolmvKitDirPath)}/**`, {cwd: path.relative(process.cwd(), path.dirname(tkoolmvKitDirPath))});
	await archive.finalize();
	// zipが不完全な状態でアップロードされるのを防ぐために、zip圧縮完了の通知が来るまで待機
	await streamClosePromise;
	console.log(`Completed: ${tkoolmvKitRuntimeZipPath}`);
	sh.exec(`gh release upload "v${version}" "${tkoolmvKitRuntimeZipPath}" --clobber`);
})();
