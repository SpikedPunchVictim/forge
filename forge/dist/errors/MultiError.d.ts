export declare class MultiError extends Error {
    readonly errors: Error[];
    get length(): number;
    constructor(errors?: Error | Error[]);
    [Symbol.iterator](): Generator<Error, void, unknown>;
}
