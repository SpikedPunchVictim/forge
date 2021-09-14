declare type RunIfAbleResult<TResult> = {
    results: TResult | undefined;
    run: boolean;
};
export interface IGoogleRateLimiter {
    async<TResults>(quota: number, fn: () => Promise<TResults>): Promise<TResults>;
}
/**
 * This class implements a Google Quota rate limtier.
 */
export declare class GoogleRateLimiter implements IGoogleRateLimiter {
    readonly quotaPerSecond: number;
    readonly quotaPerDay: number;
    private timestamp;
    private quotaCount;
    private quotaPerDayCount;
    constructor(quotaPerSecond?: number, quotaPerDay?: number);
    async<TResults>(quota: number, fn: () => Promise<TResults>): Promise<TResults>;
    runIfAble<TResult>(quota: number, fn: () => Promise<TResult>): Promise<RunIfAbleResult<TResult>>;
}
export {};
