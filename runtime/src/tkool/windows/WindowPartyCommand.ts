import { Graphics } from "../core";
import { TextManager, BattleManager } from "../managers";
import { Window_Command } from "./WindowCommand";

export class Window_PartyCommand extends Window_Command {
	constructor() {
		super();
	}

	initialize() {
		const y = Graphics.boxHeight - this.windowHeight();
		super.initialize(0, y);
		this.openness = 0;
		this.deactivate();
	}

	windowWidth() {
		return 192;
	}

	numVisibleRows() {
		return 4;
	}

	makeCommandList() {
		this.addCommand(TextManager.fight, "fight");
		this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
	}

	setup() {
		this.clearCommandList();
		this.makeCommandList();
		this.refresh();
		this.select(0);
		this.activate();
		this.open();
	}
}
