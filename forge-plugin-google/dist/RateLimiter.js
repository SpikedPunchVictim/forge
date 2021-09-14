"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleRateLimiter = void 0;
const MsPerDay = (1000 * 60) * 60 * 24;
/**
 * This class implements a Google Quota rate limtier.
 */
class GoogleRateLimiter {
    constructor(quotaPerSecond = 250, quotaPerDay = 1000000000) {
        this.quotaPerSecond = quotaPerSecond;
        this.quotaPerDay = quotaPerDay;
        this.timestamp = 0;
        this.quotaCount = 0;
        this.quotaPerDayCount = 0;
    }
    async async(quota, fn) {
        let results = undefined;
        await until(async () => await this.runIfAble(quota, fn), (able) => {
            results = able.results;
            return able.run;
        }, 50, // Dely ms
        -1 // Retry Count (infinite)
        );
        if (results === undefined) {
            throw new Error(`Google API request failed, or returned unexpected results`);
        }
        return results;
    }
    async runIfAble(quota, fn) {
        let newQuotaCount = this.quotaCount + quota;
        let current = Date.now();
        if (this.timestamp === 0) {
            this.timestamp = current;
        }
        let delay = current - this.timestamp;
        if (delay > MsPerDay) {
            console.log(`Daily quota time period has been reset. Adding ${this.quotaPerDay} quota for the day.`);
            this.quotaPerDayCount = 0;
        }
        if (this.quotaPerDayCount > this.quotaPerDay) {
            console.log(`Maximum Quota has been hit for the day. Waiting for the 24 hour period to restart`);
            return {
                results: undefined,
                run: false
            };
        }
        if (delay > 1000) {
            this.timestamp = current;
            this.quotaCount = 0;
            newQuotaCount = this.quotaCount + quota;
        }
        if (newQuotaCount < this.quotaPerSecond) {
            this.quotaCount = newQuotaCount;
            this.quotaPerDayCount += quota;
            try {
                let results = await fn();
                return { results, run: true };
            }
            catch (err) {
                if (err.code === 403 && err.message.startsWith(`Quota exceeded for quota metric`)) {
                    //console.log(`!! Quota Exceeded. Continuing as usual.`)
                    return {
                        results: undefined,
                        run: false
                    };
                }
                else {
                    throw err;
                }
            }
        }
        else {
            return {
                results: undefined,
                run: false
            };
        }
    }
}
exports.GoogleRateLimiter = GoogleRateLimiter;
/*------------------------------------------------------------------------
 * Will wait for a condition to be met before resolving. The condition is
 * attempted periodically at the given interval. The timer for the interval
 * starts after the verification process. If verify(result) returns true,
 * this method resolves, otherwise, after the delay, the task will be called again,
 * and verify() is called on that result. This process continues until the conditions
 * have been met (ie verify() returns true)
 *
 * @param {function():Promise} task Async parameterless function to call periodically
 * @param {function(result):bool} verify Verify the result from task(). If it returns true, this method is resolved, otherwise task() is called again.
 * @param {uint} delayMs The delay in ms between each call.
 * @param {uint} retryCount Number of times to retry before rejecting.
 /*---------------------------------------------------------------------*/
async function until(task, verify, delayMs, retryCount) {
    let done = false;
    let retries = 0;
    while (!done) {
        let result = await task();
        done = verify(result);
        if (done) {
            return Promise.resolve();
        }
        retries++;
        if (retryCount != -1 && retries > retryCount) {
            return Promise.reject(new Error('Retry count exceeded'));
        }
        await delay(delayMs);
    }
}
/*------------------------------------------------------------------------
 * Waits the delay in ms before resolving a promise
 * @param {uint} ms Delay in ms
 /*---------------------------------------------------------------------*/
async function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF0ZUxpbWl0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUmF0ZUxpbWl0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBU0EsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQTtBQUV0Qzs7R0FFRztBQUNILE1BQWEsaUJBQWlCO0lBUTNCLFlBQVksaUJBQXlCLEdBQUcsRUFBRSxjQUFzQixVQUFVO1FBQ3ZFLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFBO1FBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBO1FBQ25CLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLLENBQVcsS0FBYSxFQUFFLEVBQTJCO1FBQzdELElBQUksT0FBTyxHQUF5QixTQUFTLENBQUE7UUFFN0MsTUFBTSxLQUFLLENBQ1IsS0FBSyxJQUFJLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQVcsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUNyRCxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ04sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUE7WUFDdEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFBO1FBQ2xCLENBQUMsRUFDRCxFQUFFLEVBQUksVUFBVTtRQUNoQixDQUFDLENBQUMsQ0FBSSx5QkFBeUI7U0FDakMsQ0FBQTtRQUVELElBQUcsT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLDJEQUEyRCxDQUFDLENBQUE7U0FDOUU7UUFFRCxPQUFPLE9BQW1CLENBQUE7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTLENB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RTtBQUMxRSxLQUFLLFVBQVUsS0FBSyxDQUFDLEVBQVU7SUFDNUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQzVCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDYixPQUFPLEVBQUUsQ0FBQTtRQUNaLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUNULENBQUMsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbInR5cGUgUnVuSWZBYmxlUmVzdWx0PFRSZXN1bHQ+ID0ge1xuICAgcmVzdWx0czogVFJlc3VsdCB8IHVuZGVmaW5lZFxuICAgcnVuOiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUdvb2dsZVJhdGVMaW1pdGVyIHtcbiAgIGFzeW5jPFRSZXN1bHRzPihxdW90YTogbnVtYmVyLCBmbjogKCkgPT4gUHJvbWlzZTxUUmVzdWx0cz4pOiBQcm9taXNlPFRSZXN1bHRzPlxufVxuXG5jb25zdCBNc1BlckRheSA9ICgxMDAwICogNjApICogNjAgKiAyNFxuXG4vKipcbiAqIFRoaXMgY2xhc3MgaW1wbGVtZW50cyBhIEdvb2dsZSBRdW90YSByYXRlIGxpbXRpZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBHb29nbGVSYXRlTGltaXRlciBpbXBsZW1lbnRzIElHb29nbGVSYXRlTGltaXRlciB7XG4gICByZWFkb25seSBxdW90YVBlclNlY29uZDogbnVtYmVyXG4gICByZWFkb25seSBxdW90YVBlckRheTogbnVtYmVyXG5cbiAgIHByaXZhdGUgdGltZXN0YW1wOiBudW1iZXJcbiAgIHByaXZhdGUgcXVvdGFDb3VudDogbnVtYmVyXG4gICBwcml2YXRlIHF1b3RhUGVyRGF5Q291bnQ6IG51bWJlclxuXG4gICBjb25zdHJ1Y3RvcihxdW90YVBlclNlY29uZDogbnVtYmVyID0gMjUwLCBxdW90YVBlckRheTogbnVtYmVyID0gMTAwMDAwMDAwMCkge1xuICAgICAgdGhpcy5xdW90YVBlclNlY29uZCA9IHF1b3RhUGVyU2Vjb25kXG4gICAgICB0aGlzLnF1b3RhUGVyRGF5ID0gcXVvdGFQZXJEYXlcbiAgICAgIHRoaXMudGltZXN0YW1wID0gMFxuICAgICAgdGhpcy5xdW90YUNvdW50ID0gMFxuICAgICAgdGhpcy5xdW90YVBlckRheUNvdW50ID0gMFxuICAgfVxuXG4gICBhc3luYyBhc3luYzxUUmVzdWx0cz4ocXVvdGE6IG51bWJlciwgZm46ICgpID0+IFByb21pc2U8VFJlc3VsdHM+KTogUHJvbWlzZTxUUmVzdWx0cz4ge1xuICAgICAgbGV0IHJlc3VsdHM6IFRSZXN1bHRzIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgICAgIGF3YWl0IHVudGlsKFxuICAgICAgICAgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5ydW5JZkFibGU8VFJlc3VsdHM+KHF1b3RhLCBmbiksXG4gICAgICAgICAoYWJsZSkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0cyA9IGFibGUucmVzdWx0c1xuICAgICAgICAgICAgcmV0dXJuIGFibGUucnVuXG4gICAgICAgICB9LFxuICAgICAgICAgNTAsICAgLy8gRGVseSBtc1xuICAgICAgICAgLTEgICAgLy8gUmV0cnkgQ291bnQgKGluZmluaXRlKVxuICAgICAgKVxuXG4gICAgICBpZihyZXN1bHRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgR29vZ2xlIEFQSSByZXF1ZXN0IGZhaWxlZCwgb3IgcmV0dXJuZWQgdW5leHBlY3RlZCByZXN1bHRzYClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHMgYXMgVFJlc3VsdHNcbiAgIH1cblxuICAgYXN5bmMgcnVuSWZBYmxlPFRSZXN1bHQ+KFxuICAgICAgcXVvdGE6IG51bWJlcixcbiAgICAgIGZuOiAoKSA9PiBQcm9taXNlPFRSZXN1bHQ+XG4gICApOiBQcm9taXNlPFJ1bklmQWJsZVJlc3VsdDxUUmVzdWx0Pj4ge1xuICAgICAgbGV0IG5ld1F1b3RhQ291bnQgPSB0aGlzLnF1b3RhQ291bnQgKyBxdW90YVxuXG4gICAgICBsZXQgY3VycmVudCA9IERhdGUubm93KClcblxuICAgICAgaWYgKHRoaXMudGltZXN0YW1wID09PSAwKSB7XG4gICAgICAgICB0aGlzLnRpbWVzdGFtcCA9IGN1cnJlbnRcbiAgICAgIH1cblxuICAgICAgbGV0IGRlbGF5ID0gY3VycmVudCAtIHRoaXMudGltZXN0YW1wXG5cbiAgICAgIGlmIChkZWxheSA+IE1zUGVyRGF5KSB7XG4gICAgICAgICBjb25zb2xlLmxvZyhgRGFpbHkgcXVvdGEgdGltZSBwZXJpb2QgaGFzIGJlZW4gcmVzZXQuIEFkZGluZyAke3RoaXMucXVvdGFQZXJEYXl9IHF1b3RhIGZvciB0aGUgZGF5LmApXG4gICAgICAgICB0aGlzLnF1b3RhUGVyRGF5Q291bnQgPSAwXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnF1b3RhUGVyRGF5Q291bnQgPiB0aGlzLnF1b3RhUGVyRGF5KSB7XG4gICAgICAgICBjb25zb2xlLmxvZyhgTWF4aW11bSBRdW90YSBoYXMgYmVlbiBoaXQgZm9yIHRoZSBkYXkuIFdhaXRpbmcgZm9yIHRoZSAyNCBob3VyIHBlcmlvZCB0byByZXN0YXJ0YClcbiAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN1bHRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBydW46IGZhbHNlXG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChkZWxheSA+IDEwMDApIHtcbiAgICAgICAgIHRoaXMudGltZXN0YW1wID0gY3VycmVudFxuICAgICAgICAgdGhpcy5xdW90YUNvdW50ID0gMFxuICAgICAgICAgbmV3UXVvdGFDb3VudCA9IHRoaXMucXVvdGFDb3VudCArIHF1b3RhXG4gICAgICB9XG5cbiAgICAgIGlmIChuZXdRdW90YUNvdW50IDwgdGhpcy5xdW90YVBlclNlY29uZCkge1xuICAgICAgICAgdGhpcy5xdW90YUNvdW50ID0gbmV3UXVvdGFDb3VudFxuICAgICAgICAgdGhpcy5xdW90YVBlckRheUNvdW50ICs9IHF1b3RhXG5cbiAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IGZuKClcbiAgICAgICAgICAgIHJldHVybiB7IHJlc3VsdHMsIHJ1bjogdHJ1ZSB9XG4gICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gNDAzICYmIGVyci5tZXNzYWdlLnN0YXJ0c1dpdGgoYFF1b3RhIGV4Y2VlZGVkIGZvciBxdW90YSBtZXRyaWNgKSkge1xuICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgISEgUXVvdGEgRXhjZWVkZWQuIENvbnRpbnVpbmcgYXMgdXN1YWwuYClcbiAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICByZXN1bHRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICBydW46IGZhbHNlXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgdGhyb3cgZXJyXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3VsdHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHJ1bjogZmFsc2VcbiAgICAgICAgIH1cbiAgICAgIH1cbiAgIH1cbn1cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFdpbGwgd2FpdCBmb3IgYSBjb25kaXRpb24gdG8gYmUgbWV0IGJlZm9yZSByZXNvbHZpbmcuIFRoZSBjb25kaXRpb24gaXNcbiAqIGF0dGVtcHRlZCBwZXJpb2RpY2FsbHkgYXQgdGhlIGdpdmVuIGludGVydmFsLiBUaGUgdGltZXIgZm9yIHRoZSBpbnRlcnZhbFxuICogc3RhcnRzIGFmdGVyIHRoZSB2ZXJpZmljYXRpb24gcHJvY2Vzcy4gSWYgdmVyaWZ5KHJlc3VsdCkgcmV0dXJucyB0cnVlLFxuICogdGhpcyBtZXRob2QgcmVzb2x2ZXMsIG90aGVyd2lzZSwgYWZ0ZXIgdGhlIGRlbGF5LCB0aGUgdGFzayB3aWxsIGJlIGNhbGxlZCBhZ2FpbixcbiAqIGFuZCB2ZXJpZnkoKSBpcyBjYWxsZWQgb24gdGhhdCByZXN1bHQuIFRoaXMgcHJvY2VzcyBjb250aW51ZXMgdW50aWwgdGhlIGNvbmRpdGlvbnNcbiAqIGhhdmUgYmVlbiBtZXQgKGllIHZlcmlmeSgpIHJldHVybnMgdHJ1ZSlcbiAqIFxuICogQHBhcmFtIHtmdW5jdGlvbigpOlByb21pc2V9IHRhc2sgQXN5bmMgcGFyYW1ldGVybGVzcyBmdW5jdGlvbiB0byBjYWxsIHBlcmlvZGljYWxseVxuICogQHBhcmFtIHtmdW5jdGlvbihyZXN1bHQpOmJvb2x9IHZlcmlmeSBWZXJpZnkgdGhlIHJlc3VsdCBmcm9tIHRhc2soKS4gSWYgaXQgcmV0dXJucyB0cnVlLCB0aGlzIG1ldGhvZCBpcyByZXNvbHZlZCwgb3RoZXJ3aXNlIHRhc2soKSBpcyBjYWxsZWQgYWdhaW4uXG4gKiBAcGFyYW0ge3VpbnR9IGRlbGF5TXMgVGhlIGRlbGF5IGluIG1zIGJldHdlZW4gZWFjaCBjYWxsLlxuICogQHBhcmFtIHt1aW50fSByZXRyeUNvdW50IE51bWJlciBvZiB0aW1lcyB0byByZXRyeSBiZWZvcmUgcmVqZWN0aW5nLlxuIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmFzeW5jIGZ1bmN0aW9uIHVudGlsPFRSZXN1bHQ+KFxuICAgdGFzazogKCkgPT4gUHJvbWlzZTxUUmVzdWx0PixcbiAgIHZlcmlmeTogKHJlc3VsdDogVFJlc3VsdCkgPT4gYm9vbGVhbixcbiAgIGRlbGF5TXM6IG51bWJlcixcbiAgIHJldHJ5Q291bnQ6IG51bWJlclxuKTogUHJvbWlzZTx2b2lkPiB7XG4gICBsZXQgZG9uZSA9IGZhbHNlXG4gICBsZXQgcmV0cmllcyA9IDBcblxuICAgd2hpbGUgKCFkb25lKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgdGFzaygpXG5cbiAgICAgIGRvbmUgPSB2ZXJpZnkocmVzdWx0KVxuXG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICB9XG5cbiAgICAgIHJldHJpZXMrK1xuXG4gICAgICBpZiAocmV0cnlDb3VudCAhPSAtMSAmJiByZXRyaWVzID4gcmV0cnlDb3VudCkge1xuICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignUmV0cnkgY291bnQgZXhjZWVkZWQnKSlcbiAgICAgIH1cblxuICAgICAgYXdhaXQgZGVsYXkoZGVsYXlNcylcbiAgIH1cbn1cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFdhaXRzIHRoZSBkZWxheSBpbiBtcyBiZWZvcmUgcmVzb2x2aW5nIGEgcHJvbWlzZVxuICogQHBhcmFtIHt1aW50fSBtcyBEZWxheSBpbiBtc1xuIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmFzeW5jIGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICByZXNvbHZlKClcbiAgICAgIH0sIG1zKVxuICAgfSlcbn0iXX0=