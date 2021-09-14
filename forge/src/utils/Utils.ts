/**
 * Determines if a value is not undefined or null
 * 
 * @param value The value to check
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return <T>value !== undefined && <T>value !== null;
}

/**
 * Safely runs a function by determining if the function is valid.
 * @param fn The function to run
 * @param args The function parameters
 */
export async function safelyRun<TResult>(fn: any, ...args: Array<any>): Promise<TResult | undefined> {
  return fn ? fn(...args) : Promise.resolve(undefined)
}