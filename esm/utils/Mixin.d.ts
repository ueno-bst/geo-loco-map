export type Constructor<T = {}> = new (...args: any[]) => T;
export declare function getClass<T extends Constructor<object>>(base: T): T;
export declare function mixin(base: Function, ...targets: Function[]): void;
//# sourceMappingURL=Mixin.d.ts.map