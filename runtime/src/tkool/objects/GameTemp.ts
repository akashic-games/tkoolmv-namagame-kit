import { Utils } from "../core";
import { $dataCommonEvents } from "../managers/DataManager";

export class Game_Temp {
	private _isPlaytest: boolean;
	private _commonEventId: number;
	private _destinationX: number;
	private _destinationY: number;

	constructor() {
		this.initialize();
	}

	initialize() {
		this._isPlaytest = Utils.isOptionValid("test");
		this._commonEventId = 0;
		this._destinationX = null;
		this._destinationY = null;
	}

	isPlaytest() {
		return this._isPlaytest;
	}

	reserveCommonEvent(commonEventId: number) {
		this._commonEventId = commonEventId;
	}

	clearCommonEvent() {
		this._commonEventId = 0;
	}

	isCommonEventReserved() {
		return this._commonEventId > 0;
	}

	reservedCommonEvent() {
		return $dataCommonEvents[this._commonEventId];
	}

	setDestination(x: number, y: number) {
		this._destinationX = x;
		this._destinationY = y;
	}

	clearDestination() {
		this._destinationX = null;
		this._destinationY = null;
	}

	isDestinationValid() {
		return this._destinationX !== null;
	}

	destinationX() {
		return this._destinationX;
	}

	destinationY() {
		return this._destinationY;
	}
}
