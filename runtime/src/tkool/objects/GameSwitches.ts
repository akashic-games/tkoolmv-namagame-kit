import { $dataSystem, $gameMap } from "../managers/DataManager";

export class Game_Switches {
	private _data: { [key: number]: any };

	constructor() {
		this.initialize();
	}

	initialize() {
		this.clear();
	}

	clear() {
		this._data = [];
	}

	value(switchId: number) {
		return !!this._data[switchId];
	}

	setValue(switchId: number, value: any) {
		if (switchId > 0 && switchId < $dataSystem.switches.length) {
			this._data[switchId] = value;
			this.onChange();
		}
	}

	onChange() {
		$gameMap.requestRefresh();
	}
}
