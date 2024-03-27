// 汎用オブジェクトを書き換える関数
// この関数はツクールMVのプラグインでのみ使うことを想定している
let isAltered = false;
export function alterGlobalObjects(): void {
	// iframe内部且つ未書き換え状態の時に限り、書き換えを行う
	if ((window as any).top === window || isAltered) {
		return;
	}
	(Number.prototype as any).clamp = function (min: number, max: number) {
		return Math.min(Math.max(this, min), max);
	};

	(Number.prototype as any).mod = function (n: number) {
		return ((this % n) + n) % n;
	};

	(String.prototype as any).format = function () {
		const args = arguments;
		return this.replace(/%([0-9]+)/g, function (_s: string, n: number) {
			return args[Number(n) - 1];
		});
	};

	(String.prototype as any).padZero = function (length: number) {
		let s = this;
		while (s.length < length) {
			s = "0" + s;
		}
		return s;
	};

	(Number.prototype as any).padZero = function (length: number) {
		return (String(this) as any).padZero(length);
	};

	(Array.prototype as any).equals = function (array: any[]) {
		if (!array || this.length !== array.length) {
			return false;
		}
		for (let i = 0; i < this.length; i++) {
			if (this[i] instanceof Array && array[i] instanceof Array) {
				if (!this[i].equals(array[i])) {
					return false;
				}
			} else if (this[i] !== array[i]) {
				return false;
			}
		}
		return true;
	};

	(Array.prototype as any).clone = function () {
		return this.slice(0);
	};

	(Array.prototype as any).contains = function (element: any) {
		return this.indexOf(element) >= 0;
	};

	(String.prototype as any).contains = function (string: string) {
		return this.indexOf(string) >= 0;
	};

	(Math as any).randomInt = function (max: number) {
		return Math.floor(max * g.game.random.generate());
	};

	isAltered = true;
}
