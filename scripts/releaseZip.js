// キットとコンバーターを1つのzipにまとめて tkoolmv-namagame-kit リポジトリの Releaseにアップロードするジョブ
// このスクリプトでは Github CLI を利用するので、実行環境に Github CLI をインストールし、環境変数 GITHUB_CLI_TOKEN に Github トークンを設定する必要がある
// また、このスクリプト実行前に現バージョンの Releaseを Github に作成しておく必要がある
const fs = require("fs");
const os = require("os");
const path = require("path");
const sh = require("shelljs");
const archiver = require("archiver");

const tmpDirPath = fs.mkdtempSync(path.join(os.tmpdir(), "tkoolmv-namagame-kit"));
const tkoolmvKitDirPath = path.resolve(__dirname, "..", "dist", "tkoolmv-namagame-kit");
const tkoolmvConverDirPath = path.resolve(__dirname, "..", "module", "tkoolmv-namagame-converter");
const packageJson = require(path.resolve(__dirname, "..", "package.json"));

(async() => {
	const version = packageJson["version"];
	const zipDirPath = path.join(tmpDirPath, `tkoolmv-namagame-kit-${version}`);
	if (fs.existsSync(zipDirPath)) {
		sh.rm("-Rf", zipDirPath);
	}
	fs.mkdirSync(zipDirPath);
	sh.cp("-Rf", path.join(tkoolmvKitDirPath, "*"), zipDirPath);
	const converterPackageJson = require(path.join(tkoolmvConverDirPath, "package.json"));
	const converterVersion = converterPackageJson["version"];
	sh.cp(path.join(tkoolmvConverDirPath, "dist", `*${converterVersion}.exe`), zipDirPath);
	const zipPath = `${zipDirPath}.zip`;
	const ostream = fs.createWriteStream(zipPath);
	// zip圧縮完了の通知が来るまで待機するための処理
	const streamClosePromise = new Promise(resolve => ostream.on("close", resolve));
	const archive = archiver("zip");
	await archive.pipe(ostream);
	await archive.glob(`${path.basename(zipDirPath)}/**`, {cwd: path.relative(process.cwd(), path.dirname(zipDirPath))});
	await archive.finalize();
	sh.rm("-Rf", zipDirPath);
	// zipが不完全な状態でアップロードされるのを防ぐために、zip圧縮完了の通知が来るまで待機
	await streamClosePromise;
	console.log(`Completed: ${zipPath}`);
	sh.exec(`echo ${process.env.GITHUB_CLI_TOKEN} | gh auth login --with-token -h github.com`);
	sh.exec(`gh release upload "v${version}" "${zipPath}"`);
})();
