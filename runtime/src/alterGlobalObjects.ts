// 標準組み込みオブジェクトを書き換える関数
// これらはツクール MV のコアスクリプトに含まれる書き換えである
// 他コードとの共存のため、このような書き換えは本来行うべきではない。ツクール MV ニコ生ゲーム化キットは、この書き換えなしで動作するようになっている
// しかし一部のプラグインは、これらの書き換えを前提に作成されている。そのため、プラグイン実行時にはこの関数を呼び出して書き換えを行う
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
