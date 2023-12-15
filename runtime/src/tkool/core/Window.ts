import * as PIXI from "../PIXI";
import { Bitmap } from "./Bitmap";
import { Rectangle } from "./Rectangle";
import { Sprite } from "./Sprite";
import { Utils } from "./Utils";

export class Window extends PIXI.Container {
	_isWindow: boolean;
	_windowskin: Bitmap;
	_width: number;
	_height: number;
	_cursorRect: Rectangle;
	_openness: number;
	_animationCount: number;

	_padding: number;
	_margin: number;
	_colorTone: number[];

	_windowSpriteContainer: PIXI.Container;
	_windowBackSprite: Sprite;
	_windowCursorSprite: Sprite;
	_windowFrameSprite: Sprite;
	_windowContentsSprite: Sprite;
	_windowArrowSprites: Sprite[];
	_windowPauseSignSprite: Sprite;

	_downArrowSprite: Sprite;
	_upArrowSprite: Sprite;

	origin: { x: number; y: number };
	active: boolean;
	downArrowVisible: boolean;
	upArrowVisible: boolean;
	pause: boolean;

	_inited: boolean;

	constructor(...args: any[]) {
		super(...args);
		// if (Object.getPrototypeOf(this) === Window.prototype) {
		// 	this.initialize();
		// }
	}

	initialize(..._args: any[]) {
		this._isWindow = true;
		this._windowskin = null;
		this._width = 0;
		this._height = 0;
		this._cursorRect = new Rectangle();
		this._openness = 255;
		this._animationCount = 0;

		this._padding = 18;
		this._margin = 4;
		this._colorTone = [0, 0, 0];

		this._windowSpriteContainer = null;
		this._windowBackSprite = null;
		this._windowCursorSprite = null;
		this._windowFrameSprite = null;
		this._windowContentsSprite = null;
		this._windowArrowSprites = [];
		this._windowPauseSignSprite = null;

		this._createAllParts();

		this.origin = { x: 0, y: 0 };
		this.active = true;
		this.downArrowVisible = false;
		this.upArrowVisible = false;
		this.pause = false;

		this._inited = true;
	}

	get windowskin() {
		return this._windowskin;
	}

	set windowskin(value: Bitmap) {
		if (this._windowskin !== value) {
			this._windowskin = value;
			this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));
		}
	}

	get contents() {
		return this._windowContentsSprite.bitmap;
	}

	set contents(value: Bitmap) {
		this._windowContentsSprite.bitmap = value;
	}

	get width() {
		return this._width;
	}

	set width(value: number) {
		this._width = value;
		this._refreshAllParts();
	}

	get height() {
		return this._height;
	}

	set height(value: number) {
		this._height = value;
		this._refreshAllParts();
	}

	get padding() {
		return this._padding;
	}

	set padding(value: number) {
		this._padding = value;
		this._refreshAllParts();
	}

	get margin() {
		return this._margin;
	}

	set margin(value: number) {
		this._margin = value;
		this._refreshAllParts();
	}

	get opacity() {
		return this._windowSpriteContainer.alpha * 255;
	}

	set opacity(value: number) {
		this._windowSpriteContainer.alpha = Utils.clamp(value, 0, 255) / 255;
	}

	get backOpacity() {
		return this._windowBackSprite.alpha * 255;
	}

	set backOpacity(value: number) {
		this._windowBackSprite.alpha = Utils.clamp(value, 0, 255) / 255;
	}

	get contentsOpacity() {
		return this._windowContentsSprite.alpha * 255;
	}

	set contentsOpacity(value: number) {
		this._windowContentsSprite.alpha = Utils.clamp(value, 0, 255) / 255;
	}

	get openness() {
		return this._openness;
	}

	set openness(value: number) {
		if (this._openness !== value) {
			this._openness = Utils.clamp(value, 0, 255);
			this._windowSpriteContainer.scale.y = this._openness / 255;
			this._windowSpriteContainer.y = (this.height / 2) * (1 - this._openness / 255);
			this._windowSpriteContainer.modified();
		}
	}

	update() {
		if (this.active) {
			this._animationCount++;
		}
		this.children.forEach(child => {
			if (child.update) {
				child.update();
			}
		});

		// 手抜き
		this.modified();
	}

	move(x: number, y: number, width: number, height: number) {
		this.x = x || 0;
		this.y = y || 0;
		if (this._width !== width || this._height !== height) {
			this._width = width || 0;
			this._height = height || 0;
			this._refreshAllParts();
		}
	}

	isOpen(): boolean {
		return this._openness >= 255;
	}

	isClosed(): boolean {
		return this._openness <= 0;
	}

	setCursorRect(x: number, y: number, width: number, height: number) {
		const cx = Math.floor(x || 0);
		const cy = Math.floor(y || 0);
		const cw = Math.floor(width || 0);
		const ch = Math.floor(height || 0);
		const rect = this._cursorRect;
		if (rect.x !== cx || rect.y !== cy || rect.width !== cw || rect.height !== ch) {
			this._cursorRect.x = cx;
			this._cursorRect.y = cy;
			this._cursorRect.width = cw;
			this._cursorRect.height = ch;
			this._refreshCursor();
		}
	}

	setTone(r: number, g: number, b: number) {
		const tone = this._colorTone;
		if (r !== tone[0] || g !== tone[1] || b !== tone[2]) {
			this._colorTone = [r, g, b];
			this._refreshBack();
		}
	}

	addChildToBack(child: PIXI.Container) {
		const containerIndex = this.children.indexOf(this._windowSpriteContainer);
		return this.addChildAt(child, containerIndex + 1);
	}

	updateTransform() {
		this._updateCursor();
		this._updateArrows();
		this._updatePauseSign();
		this._updateContents();

		super.updateTransform();
	}

	/**
	 * @method _createAllParts
	 * @private
	 */
	_createAllParts() {
		this._windowSpriteContainer = new PIXI.Container();
		this._windowBackSprite = new Sprite();
		this._windowCursorSprite = new Sprite();
		this._windowFrameSprite = new Sprite();
		this._windowContentsSprite = new Sprite();
		this._downArrowSprite = new Sprite();
		this._upArrowSprite = new Sprite();
		this._windowPauseSignSprite = new Sprite();
		this._windowBackSprite.bitmap = new Bitmap(1, 1);
		this._windowBackSprite.alpha = 192 / 255;
		this.addChild(this._windowSpriteContainer);
		this._windowSpriteContainer.addChild(this._windowBackSprite);
		this._windowSpriteContainer.addChild(this._windowFrameSprite);
		this.addChild(this._windowCursorSprite);
		this.addChild(this._windowContentsSprite);
		this.addChild(this._downArrowSprite);
		this.addChild(this._upArrowSprite);
		this.addChild(this._windowPauseSignSprite);
	}

	/**
	 * @method _onWindowskinLoad
	 * @private
	 */
	_onWindowskinLoad() {
		this._refreshAllParts();
	}

	/**
	 * @method _refreshAllParts
	 * @private
	 */
	_refreshAllParts() {
		if (!this._inited) {
			return;
		}

		this._refreshBack();
		this._refreshFrame();
		this._refreshCursor();
		this._refreshContents();
		this._refreshArrows();
		this._refreshPauseSign();
	}

	/**
	 * @method _refreshBack
	 * @private
	 */
	_refreshBack() {
		const m = this._margin;
		const w = this._width - m * 2;
		const h = this._height - m * 2;
		const bitmap = new Bitmap(w, h);

		this._windowBackSprite.bitmap = bitmap;
		this._windowBackSprite.setFrame(0, 0, w, h);
		this._windowBackSprite.move(m, m);

		if (w > 0 && h > 0 && this._windowskin) {
			const p = 96;
			bitmap.blt(this._windowskin, 0, 0, p, p, 0, 0, w, h);
			for (let y = 0; y < h; y += p) {
				for (let x = 0; x < w; x += p) {
					bitmap.blt(this._windowskin, 0, p, p, p, x, y, p, p);
				}
			}
			const tone = this._colorTone;
			bitmap.adjustTone(tone[0], tone[1], tone[2]);
		}
	}

	/**
	 * @method _refreshFrame
	 * @private
	 */
	_refreshFrame() {
		const w = this._width;
		const h = this._height;
		const m = 24;
		const bitmap = new Bitmap(w, h);

		this._windowFrameSprite.bitmap = bitmap;
		this._windowFrameSprite.setFrame(0, 0, w, h);

		if (w > 0 && h > 0 && this._windowskin) {
			const skin = this._windowskin;
			const p = 96;
			const q = 96;
			bitmap.blt(skin, p + m, 0 + 0, p - m * 2, m, m, 0, w - m * 2, m);
			bitmap.blt(skin, p + m, 0 + q - m, p - m * 2, m, m, h - m, w - m * 2, m);
			bitmap.blt(skin, p + 0, 0 + m, m, p - m * 2, 0, m, m, h - m * 2);
			bitmap.blt(skin, p + q - m, 0 + m, m, p - m * 2, w - m, m, m, h - m * 2);
			bitmap.blt(skin, p + 0, 0 + 0, m, m, 0, 0, m, m);
			bitmap.blt(skin, p + q - m, 0 + 0, m, m, w - m, 0, m, m);
			bitmap.blt(skin, p + 0, 0 + q - m, m, m, 0, h - m, m, m);
			bitmap.blt(skin, p + q - m, 0 + q - m, m, m, w - m, h - m, m, m);
		}
	}

	/**
	 * @method _refreshCursor
	 * @private
	 */
	_refreshCursor() {
		const pad = this._padding;
		const x = this._cursorRect.x + pad - this.origin.x;
		const y = this._cursorRect.y + pad - this.origin.y;
		const w = this._cursorRect.width;
		const h = this._cursorRect.height;
		const m = 4;
		const x2 = Math.max(x, pad);
		const y2 = Math.max(y, pad);
		const ox = x - x2;
		const oy = y - y2;
		const w2 = Math.min(w, this._width - pad - x2);
		const h2 = Math.min(h, this._height - pad - y2);
		const bitmap = new Bitmap(w2, h2);

		this._windowCursorSprite.bitmap = bitmap;
		this._windowCursorSprite.setFrame(0, 0, w2, h2);
		this._windowCursorSprite.move(x2, y2);

		if (w > 0 && h > 0 && this._windowskin) {
			const skin = this._windowskin;
			const p = 96;
			const q = 48;
			bitmap.blt(skin, p + m, p + m, q - m * 2, q - m * 2, ox + m, oy + m, w - m * 2, h - m * 2);
			bitmap.blt(skin, p + m, p + 0, q - m * 2, m, ox + m, oy + 0, w - m * 2, m);
			bitmap.blt(skin, p + m, p + q - m, q - m * 2, m, ox + m, oy + h - m, w - m * 2, m);
			bitmap.blt(skin, p + 0, p + m, m, q - m * 2, ox + 0, oy + m, m, h - m * 2);
			bitmap.blt(skin, p + q - m, p + m, m, q - m * 2, ox + w - m, oy + m, m, h - m * 2);
			bitmap.blt(skin, p + 0, p + 0, m, m, ox + 0, oy + 0, m, m);
			bitmap.blt(skin, p + q - m, p + 0, m, m, ox + w - m, oy + 0, m, m);
			bitmap.blt(skin, p + 0, p + q - m, m, m, ox + 0, oy + h - m, m, m);
			bitmap.blt(skin, p + q - m, p + q - m, m, m, ox + w - m, oy + h - m, m, m);
		}
	}

	/**
	 * @method _refreshContents
	 * @private
	 */
	_refreshContents() {
		this._windowContentsSprite.move(this.padding, this.padding);
	}

	/**
	 * @method _refreshArrows
	 * @private
	 */
	_refreshArrows() {
		const w = this._width;
		const h = this._height;
		const p = 24;
		const q = p / 2;
		const sx = 96 + p;
		const sy = 0 + p;
		this._downArrowSprite.bitmap = this._windowskin;
		this._downArrowSprite.anchor.x = 0.5;
		this._downArrowSprite.anchor.y = 0.5;
		this._downArrowSprite.setFrame(sx + q, sy + q + p, p, q);
		this._downArrowSprite.move(w / 2, h - q);
		this._upArrowSprite.bitmap = this._windowskin;
		this._upArrowSprite.anchor.x = 0.5;
		this._upArrowSprite.anchor.y = 0.5;
		this._upArrowSprite.setFrame(sx + q, sy, p, q);
		this._upArrowSprite.move(w / 2, q);
		this._updateArrows(); // TODO: 本来ここで_updateArrows()を呼ぶのは妥当ではないと思われるが、不要な矢印の表示を防ぐため暫定対応としてこの処理を行う
	}

	/**
	 * @method _refreshPauseSign
	 * @private
	 */
	_refreshPauseSign() {
		const sx = 144;
		const sy = 96;
		const p = 24;
		this._windowPauseSignSprite.bitmap = this._windowskin;
		this._windowPauseSignSprite.anchor.x = 0.5;
		this._windowPauseSignSprite.anchor.y = 1;
		this._windowPauseSignSprite.move(this._width / 2, this._height);
		this._windowPauseSignSprite.setFrame(sx, sy, p, p);
		this._windowPauseSignSprite.alpha = 0;
	}

	/**
	 * @method _updateCursor
	 * @private
	 */
	_updateCursor() {
		const blinkCount = this._animationCount % 40;
		let cursorOpacity = this.contentsOpacity;
		if (this.active) {
			if (blinkCount < 20) {
				cursorOpacity -= blinkCount * 8;
			} else {
				cursorOpacity -= (40 - blinkCount) * 8;
			}
		}
		this._windowCursorSprite.alpha = cursorOpacity / 255;
		this._windowCursorSprite.visible = this.isOpen();
	}

	/**
	 * @method _updateContents
	 * @private
	 */
	_updateContents() {
		const w = this._width - this._padding * 2;
		const h = this._height - this._padding * 2;
		if (w > 0 && h > 0) {
			this._windowContentsSprite.setFrame(this.origin.x, this.origin.y, w, h);
			this._windowContentsSprite.visible = this.isOpen();
		} else {
			this._windowContentsSprite.visible = false;
		}
	}

	/**
	 * @method _updateArrows
	 * @private
	 */
	_updateArrows() {
		this._downArrowSprite.visible = this.isOpen() && this.downArrowVisible;
		this._upArrowSprite.visible = this.isOpen() && this.upArrowVisible;
	}

	/**
	 * @method _updatePauseSign
	 * @private
	 */
	_updatePauseSign() {
		const sprite = this._windowPauseSignSprite;
		const x = Math.floor(this._animationCount / 16) % 2;
		const y = Math.floor(this._animationCount / 16 / 2) % 2;
		const sx = 144;
		const sy = 96;
		const p = 24;
		if (!this.pause) {
			sprite.alpha = 0;
		} else if (sprite.alpha < 1) {
			sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
		}
		sprite.setFrame(sx + x * p, sy + y * p, p, p);
		sprite.visible = this.isOpen();
	}
}
