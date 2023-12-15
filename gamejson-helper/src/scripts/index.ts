import type { GameConfiguration } from "@akashic/game-configuration";
import { GameJsonError, makeGamejson } from "./fileUtil";

window.addEventListener("load", () => {
	const dropZone = document.getElementById("drop_zone")!;
	const result = document.getElementById("result")!;
	const download = document.getElementById("download")! as HTMLButtonElement;
	const messageArea = document.getElementById("message_area")!;

	let gamejson: GameConfiguration | null = null;
	dropZone.addEventListener("drop", async (ev: DragEvent) => {
		ev.preventDefault();
		if (!ev.dataTransfer?.items?.length) return;
		messageArea.innerHTML = "";
		const entry = ev.dataTransfer.items[0].webkitGetAsEntry();
		if (!entry) return;

		if (entry.isFile) {
			messageArea.innerHTML = "game.json を含むフォルダをドラッグ＆ドロップしてください。";
			return;
		}

		try {
			gamejson = await makeGamejson(entry);
			result.innerHTML = JSON.stringify(gamejson, null, 2).replace(/\n/g, "<br>");
			download.disabled = false;
		} catch (e) {
			if (e instanceof GameJsonError) {
				messageArea.innerHTML = e.message;
			}
		}
	});
	dropZone.addEventListener("dragover", ev => ev.preventDefault());

	download.addEventListener("click", () => {
		const text = JSON.stringify(gamejson!, null, 2);
		const blob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.target = "_blank";
		anchor.download = "game.json";
		anchor.click();
		URL.revokeObjectURL(url);
	});
});
