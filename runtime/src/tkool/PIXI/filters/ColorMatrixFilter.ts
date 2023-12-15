import { Filter } from "./Filter";

declare const console: any;

// PIXIの当該機能のインターフェースだけ持ってきたもの。空振りする。
// see: http://pixijs.download/dev/docs/packages_filters_filter-color-matrix_src_ColorMatrixFilter.js.html

export class ColorMatrixFilter extends Filter {
	hue(_value: number, _b: boolean) {
		console.log("❗ColorMatrixFilter#hue called");
	}

	saturate(_value: number, _b: boolean) {
		console.log("❗ColorMatrixFilter#saturate called");
	}

	reset() {
		//
	}

	_loadMatrix(_matrix: number[], _b: boolean) {
		console.log("❗ColorMatrixFilter#_loadMatrix called");
	}
}
