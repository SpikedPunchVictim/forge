export interface IDefer<T> {
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T> | undefined) => void;
    reject: (err: Error) => void;
}
export declare function defer<T>(): IDefer<T>;
export declare function sequence(promises: Array<() => Promise<any>>): Promise<void>;
