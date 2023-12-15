const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
	console.error("please specify path of game.json. ex: node updateAusioAssets.js game.json");
	process.exit(1);
}

const gameJsonPath = path.resolve(process.cwd(), process.argv[2]);
const gameJson = require(gameJsonPath);

// 音声アセットの更新
Object.keys(gameJson.assets).forEach(key => {
	if (gameJson.assets[key].type !== "audio") {
		return;
	}
	gameJson.assets[key].global = true; // ツクールだとデータ構造的にどこでどの音声が使われるか分からないので、全音声アセットを global:true にする
	const audioType = gameJson.assets[key].path.split("/")[2];
	switch (audioType) {
		case "bgm":
			gameJson.assets[key].systemId = "music";
			gameJson.assets[key].loop = true;
			break;
		case "bgs":
			gameJson.assets[key].systemId = "sound";
			gameJson.assets[key].loop = true;
			break;
		case "me":
			gameJson.assets[key].systemId = "music";
			gameJson.assets[key].loop = false;
			break;
	}
});

fs.writeFileSync(gameJsonPath, JSON.stringify(gameJson, null, "\t"));
