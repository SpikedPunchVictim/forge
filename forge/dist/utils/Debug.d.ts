export interface IElapsedToken {
    key: [number, number];
    seconds: number;
    ms: number;
    totalMs: number;
}
export declare function elapsedTime(token?: IElapsedToken): IElapsedToken;
export declare function inspect(name: any, obj: any, options: any): void;
