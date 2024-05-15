// キットとコンバーターを1つのzipにまとめて tkoolmv-namagame-kit リポジトリの Releaseにアップロードするジョブ
// このスクリプトでは Github CLI を利用するので、実行環境に Github CLI をインストールし、環境変数 GITHUB_CLI_TOKEN に Github トークンを設定する必要がある
// また、このスクリプト実行前に現バージョンの Releaseを Github に作成しておく必要がある
const fs = require("fs");
const os = require("os");
const path = require("path");
const sh = require("shelljs");
const execCommand = require("./util/execCommand");
const compressToZip = require("./util/compressToZip");

const tmpDirPath = fs.mkdtempSync(path.join(os.tmpdir(), "tkoolmv-namagame-kit"));
const tkoolmvConverDirPath = path.resolve(__dirname, "..", "module", "tkoolmv-namagame-converter");
const packageJson = require(path.resolve(__dirname, "..", "package.json"));

(async() => {
	const version = packageJson["version"];
	const zipDirPath = path.join(tmpDirPath, `tkoolmv-namagame-kit-${version}`);
	if (fs.existsSync(zipDirPath)) {
		sh.rm("-Rf", zipDirPath);
	}
	fs.mkdirSync(zipDirPath);

	// ランタイムのインストール・同梱
	execCommand("npm i @akashic/tkoolmv-namagame-runtime@latest"); // コアスクリプトを runtime モジュールから取得するため npm install する
	const tkoolmvRuntimeDirPath = path.resolve(__dirname, "../node_modules/@akashic/tkoolmv-namagame-runtime/dist/tkoolmv-namagame-runtime");
	sh.cp("-R", path.join(tkoolmvRuntimeDirPath, "*"), zipDirPath);
	// ReleaseNoteの作成の際にランタイムのバージョン情報が必要なので予めここで取得しておく
	const runtimePackageJson = require(path.resolve(__dirname, "../node_modules/@akashic/tkoolmv-namagame-runtime/package.json"));
	const runtimeVersion = runtimePackageJson["version"];
	execCommand("npm uninstall @akashic/tkoolmv-namagame-runtime"); // 以降で runtime は不要なので uninstall

	// コンバーターの同梱
	const converterPackageJson = require(path.join(tkoolmvConverDirPath, "package.json"));
	const converterVersion = converterPackageJson["version"];
	sh.cp(path.join(tkoolmvConverDirPath, "dist", `*${converterVersion}.exe`), zipDirPath);

	// CHANGELOGの同梱
	sh.cp(path.resolve(__dirname, "..", "CHANGELOG.md"), zipDirPath);

	// zip圧縮処理
	const zipPath = path.join(tmpDirPath, `tkoolmv-namagame-kit.zip`);
	await compressToZip(zipDirPath, zipPath);
	sh.rm("-Rf", zipDirPath); // zip圧縮後zipDirPathは不要なので削除

	// ReleaseNoteの作成とzipファイルのアップロード
	const releaseNoteContent = `* @akashic/tkoolmv-namagame-kit@${version}
  * [@akashic/tkoolmv-namagame-converter@${converterVersion}](https://github.com/akashic-games/tkoolmv-namagame-converter/releases/tag/v${converterVersion})
  * [@akashic/tkoolmv-namagame-runtime@${runtimeVersion}](https://github.com/akashic-games/tkoolmv-namagame-runtime/releases/tag/v${runtimeVersion})
`;
	execCommand(`echo ${process.env.GITHUB_CLI_TOKEN} | gh auth login --with-token -h github.com`);
	sh.exec(`gh release create "v${version}" -t "Release v${version}" --target "main" -F "${releaseNoteContent}"`);
	execCommand(`gh release upload "v${version}" "${zipPath}"`);
})();
