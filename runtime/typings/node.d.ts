declare const require: (path: string) => any;
declare const window: {
	setTimeout: (func: () => void, time: number) => any,
	clearTimeout: (timer: any) => void
};
declare const module: g.Module;
