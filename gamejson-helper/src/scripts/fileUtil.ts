import type {
	AssetConfigurationMap,
	AudioAssetConfigurationBase,
	GameConfiguration,
	ImageAssetConfigurationBase,
	TextAssetConfigurationBase
} from "@akashic/game-configuration";

/**
 * File を画像としてロードし、サイズを取得する。
 * @param file 対象のファイル
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = document.createElement("img");
		img.src = url;
		img.onload = function () {
			URL.revokeObjectURL(url);
			resolve({ width: img.width, height: img.height });
		};
		img.onerror = function (e) {
			reject(e);
		};
	});
}

export interface FileInfo {
	/**
	 * 対象の File 。
	 */
	file: File;
	/**
	 * 対象の相対パス。
	 */
	path: string;
}

export interface Plugin {
	name: string;
	status: boolean;
	description: string;
	parameters: object;
}

export interface CommunityBasicParameters {
	screenWidth: string;
	screenHeight: string;
}

export interface AkashicRankingModeParameters {
	scoreVariableNumber: string;
	totalTimeLimit: string;
	titleTime: string;
	graceTime: string;
	prohibitMenu: string;
}

export class GameJsonError extends Error {}

/**
 * FileSystemEntry の特にディレクトリを再帰的にトラバースして File と相対パス情報を集める。
 * @param entry ルートの FileSystemEntry
 * @returns 集めた File と相対パス情報の配列
 */
export async function collectFiles(entry: FileSystemEntry): Promise<FileInfo[]> {
	return iter([], "", entry);

	async function iter(acc: FileInfo[], path: string, entry: FileSystemEntry): Promise<FileInfo[]> {
		if (!entry) return acc;

		if (entry.isDirectory) {
			const reader = (entry as FileSystemDirectoryEntry).createReader();
			return new Promise((resolve, reject) => {
				function readEntriesRecursive() {
					reader.readEntries(async children => {
						if (!children || children.length === 0) {
							resolve(acc);
							return;
						}
						for (const child of children) {
							await iter(acc, `${path}/${entry.name}`, child);
						}
						readEntriesRecursive();
					}, reject);
				}

				readEntriesRecursive();
			});
		} else if (entry.isFile) {
			return new Promise((resolve, reject) => {
				(entry as FileSystemFileEntry).file(file => {
					// ブラウザによって name が NFC か NFD か異なるようなので、normalize() で NFC に揃えておく。
					// Mac Chrome は NFD, Mac Firefox は NFC の模様 (前者は濁点を含む文字の濁点を独立した文字 U+E38299 にしてくる)。
					// ref. https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
					acc.push({ file, path: `${path}/${entry.name}`.normalize() });
					resolve(acc);
				}, reject);
			});
		} else {
			return acc;
		}
	}
}

/**
 * 与えられた FileInfo[] の相対パスから、ルートの game.json までの共通接頭辞を削る。
 * @param files 対象の FileInfo[]
 */
export function stripCommonPathSegments(files: FileInfo[]): void {
	if (files.length === 0) return;

	const gameJsons = files.filter(f => /\/game.json$/.test(f.path));
	if (gameJsons.length === 0) throw new GameJsonError("ドラッグ＆ドロップされたフォルダに game.json が存在しません。");
	if (gameJsons.length > 1)
		throw new GameJsonError("ドラッグ＆ドロップされたフォルダに game.json が複数存在します。game.json は1ファイルのみ必要です。");

	const root = gameJsons[0].path.replace(/game.json$/, "");
	const re = new RegExp("^" + root);
	files.forEach(f => {
		f.path = f.path.replace(re, "");
	});
}

/**
 * 音声ファイルをロードし、duration を取得する。
 * @param file 対象ファイル
 */
export async function getAudioDuration(file: File): Promise<number> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const audio = new Audio();
		audio.src = url;
		audio.load();

		audio.addEventListener("loadedmetadata", function (e) {
			URL.revokeObjectURL(url);
			resolve(Math.ceil(audio.duration * 1000));
		});
		audio.onerror = function (e) {
			URL.revokeObjectURL(url);
			reject(e);
		};
	});
}

export interface AudioDurationInfo {
	ext: string;
	duration: number;
}
export type AudioDurationInfoMap = { [path: string]: AudioDurationInfo };

/**
 * 与えられた FileSystemEntry 下にあるゲームコンテンツの、assets/ や text/ をアセット登録した game.json を生成する。
 *
 * @param entry ルートの FileSystemEntry
 * @returns 生成された game.json 。ゲームコンテンツ内にある game.json の、assets プロパティに追記したもの
 */
export async function makeGamejson(entry: FileSystemEntry): Promise<GameConfiguration> {
	const files = await collectFiles(entry);
	stripCommonPathSegments(files);

	const assets: AssetConfigurationMap = {};
	const durationMap: AudioDurationInfoMap = {};
	const extMap: { [key: string]: Set<string> } = {};
	for (const { file, path } of files) {
		if (/\/\.gitkeep$/.test(path)) continue;

		if (/^(image|assets)\//.test(path) && (file.type === "image/png" || file.type === "image/png")) {
			const size = await getImageDimensions(file);
			const decl: ImageAssetConfigurationBase = {
				type: "image",
				path: path,
				width: size.width,
				height: size.height,
				hint: {
					untainted: true
				}
			};
			assets[decl.path] = decl;
		} else if (/^(audio|assets)\/.*\.(?:ogg|aac|m4a|mp4)$/.test(path)) {
			const ext = path.split(".").pop()!;
			const assetPath = path.replace(/\.(ogg|aac|m4a|mp4)$/, "");
			if (!extMap[assetPath]) extMap[assetPath] = new Set<string>();
			extMap[assetPath].add(`.${ext}`);
			const extensions = Array.from(extMap[assetPath]);
			let duration;

			if (assets[assetPath]) {
				const asset = assets[assetPath] as AudioAssetConfigurationBase;
				asset.hint = { extensions };
				if (durationMap[assetPath].ext !== "ogg") {
					duration = await getAudioDuration(file);
					// 現在の拡張子が ogg の場合あるいは duration が大きい場合は duration を更新する
					if (ext === "ogg" || asset.duration < duration) {
						asset.duration = duration;
						durationMap[assetPath] = { ext, duration };
					}
				}
				continue;
			}

			duration = await getAudioDuration(file);
			const isSe = /\/(?:se|me)\//.test(path);
			const decl: AudioAssetConfigurationBase = {
				type: "audio",
				path: assetPath,
				duration: duration,
				systemId: isSe ? "sound" : "music",
				global: true,
				hint: { extensions }
			};
			assets[decl.path] = decl;
			durationMap[assetPath] = { ext, duration };
		} else if (/^text\//.test(path)) {
			const decl: TextAssetConfigurationBase = {
				type: "text",
				path,
				global: true
			};
			const aid = decl.path.replace(/^.*\//, "").replace(/\.[^\.]+$/, "");
			assets[aid] = decl;
		}
	}

	const gameJson: GameConfiguration = JSON.parse(await files.find(f => f.path === "game.json")!.file.text()); // strip〜を通過した時点で必ず存在する
	// Plugins.jsonの情報取得
	const pluginsJson: Plugin[] = JSON.parse((await files.find(f => f.path === "text/Plugins.json")?.file.text()) ?? "[]");
	let communityBasic: CommunityBasicParameters | null = null;
	let akashicRankingMode: AkashicRankingModeParameters | null = null;
	for (let plugin of pluginsJson) {
		if (!plugin.status) {
			continue;
		}
		switch (plugin.name) {
			case "Community_Basic":
				communityBasic = plugin.parameters as CommunityBasicParameters;
				break;
			case "AkashicRankingMode":
				akashicRankingMode = plugin.parameters as AkashicRankingModeParameters;
				break;
		}
	}

	return {
		...gameJson,
		width: communityBasic ? Number(communityBasic.screenWidth) : gameJson.width,
		height: communityBasic ? Number(communityBasic.screenHeight) : gameJson.height,
		assets: {
			...gameJson.assets,
			...assets
		},
		environment: {
			...gameJson.environment,
			nicolive: {
				...gameJson.environment?.nicolive,
				preferredSessionParameters: {
					// akashicRankingModeプラグインが無効な時は、totalTimeLimitのデフォルト値を指定する
					totalTimeLimit: akashicRankingMode ? Number(akashicRankingMode.totalTimeLimit) : 75
				}
			},
			external: {
				send: "0"
			},
			"akashic-runtime": {
				version: "~3.7.9-0",
				flavor: "-canvas"
			}
		}
	};
}
