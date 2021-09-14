/**
 * Determines if a value is not undefined or null
 *
 * @param value The value to check
 */
export declare function isDefined<T>(value: T | undefined | null): value is T;
/**
 * Safely runs a function by determining if the function is valid.
 * @param fn The function to run
 * @param args The function parameters
 */
export declare function safelyRun<TResult>(fn: any, ...args: Array<any>): Promise<TResult | undefined>;
