import { DataManager, SoundManager, TextManager } from "../managers";
import { $gameSystem } from "../managers/DataManager";
import { StorageManager } from "../managers/StorageManager";
import { Scene_File } from "./SceneFile";

export class Scene_Save extends Scene_File {
	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_Save.prototype) {
			this.initialize();
		}
	}

	initialize() {
		super.initialize();
	}

	mode() {
		return "save";
	}

	helpWindowText() {
		return TextManager.saveMessage;
	}

	firstSavefileIndex() {
		return DataManager.lastAccessedSavefileId() - 1;
	}

	onSavefileOk() {
		super.onSavefileOk();
		$gameSystem.onBeforeSave();
		if (DataManager.saveGame(this.savefileId())) {
			this.onSaveSuccess();
		} else {
			this.onSaveFailure();
		}
	}

	onSaveSuccess() {
		SoundManager.playSave();
		StorageManager.cleanBackup(this.savefileId());
		this.popScene();
	}

	onSaveFailure() {
		SoundManager.playBuzzer();
		this.activateListWindow();
	}
}
