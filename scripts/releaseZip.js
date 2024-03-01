// キットとコンバーターを1つのzipにまとめて tkoolmv-namagame-kit リポジトリの Rleases にアップロードするジョブ
// このスクリプトでは Github CLI を利用するので、実行環境に Github CLI をインストールし、環境変数 GITHUB_CLI_TOKEN に Github トークンを設定する必要がある
// また、このスクリプト実行前に現バージョンの Rleases を Github に作成しておく必要がある
const fs = require("fs");
const os = require("os");
const path = require("path");
const sh = require("shelljs");
const archiver = require("archiver");

const tmpDirPath = fs.mkdtempSync(path.join(os.tmpdir(), "tkoolmv-namagame-kit"));
const tkoolmvKitDirPath = path.resolve(__dirname, "..", "dist", "tkoolmv-namagame-kit");
const tkoolmvConverDirPath = path.resolve(__dirname, "..", "module", "tkoolmv-namagame-converter", "dist");
const packageJson = require(path.resolve(__dirname, "..", "package.json"));

(async() => {
	const version = packageJson["version"];
	const zipDirPath = path.join(tmpDirPath, `tkoolmv-namagame-kit-${version}`);
	sh.rm("-Rf", zipDirPath);
	fs.mkdirSync(zipDirPath);
	sh.cp("-Rf", path.join(tkoolmvKitDirPath, "*"), zipDirPath);
	sh.cp(path.join(tkoolmvConverDirPath, "*.exe"), zipDirPath);
	const zipPath = await makeZip(zipDirPath);
	sh.exec(`echo ${process.env.GITHUB_CLI_TOKEN} | gh auth login --with-token -h github.com`);
	sh.exec(`gh release upload "v${version}" "${zipPath}"`);
})();

async function makeZip(dirPath, zipName) {
	const zipPath = zipName ? path.join(path.dirname(dirPath), `${zipName}.zip`) : `${dirPath}.zip`;
	if (fs.existsSync(zipPath)) {
		sh.rm("-Rf", zipPath);
	}
	const ostream = fs.createWriteStream(zipPath);
	const archive = archiver("zip");
	await archive.pipe(ostream);
	await archive.glob(`${path.basename(dirPath)}/**`, {cwd: path.relative(process.cwd(), path.dirname(dirPath))});
	await archive.finalize();
	sh.rm("-Rf", dirPath);
	return zipPath;
}
