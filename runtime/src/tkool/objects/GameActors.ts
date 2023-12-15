import { $dataActors } from "../managers/DataManager";
import { Game_Actor } from "./GameActor";

export class Game_Actors {
	_data: Game_Actor[];

	constructor() {
		this.initialize();
	}

	initialize() {
		this._data = [];
	}

	actor(actorId: number) {
		if ($dataActors[actorId]) {
			if (!this._data[actorId]) {
				this._data[actorId] = new Game_Actor(actorId);
			}
			return this._data[actorId];
		}
		return null;
	}
}
