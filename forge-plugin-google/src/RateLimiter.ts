type RunIfAbleResult<TResult> = {
   results: TResult | undefined
   run: boolean
}

export interface IGoogleRateLimiter {
   async<TResults>(quota: number, fn: () => Promise<TResults>): Promise<TResults>
}

const MsPerDay = (1000 * 60) * 60 * 24

/**
 * This class implements a Google Quota rate limtier.
 */
export class GoogleRateLimiter implements IGoogleRateLimiter {
   readonly quotaPerSecond: number
   readonly quotaPerDay: number

   private timestamp: number
   private quotaCount: number
   private quotaPerDayCount: number

   constructor(quotaPerSecond: number = 250, quotaPerDay: number = 1000000000) {
      this.quotaPerSecond = quotaPerSecond
      this.quotaPerDay = quotaPerDay
      this.timestamp = 0
      this.quotaCount = 0
      this.quotaPerDayCount = 0
   }

   async async<TResults>(quota: number, fn: () => Promise<TResults>): Promise<TResults> {
      let results: TResults | undefined = undefined

      await until(
         async () => await this.runIfAble<TResults>(quota, fn),
         (able) => {
            results = able.results
            return able.run
         },
         50,   // Dely ms
         -1    // Retry Count (infinite)
      )

      if(results === undefined) {
         throw new Error(`Google API request failed, or returned unexpected results`)
      }

      return results as TResults
   }

   async runIfAble<TResult>(
      quota: number,
      fn: () => Promise<TResult>
   ): Promise<RunIfAbleResult<TResult>> {
      let newQuotaCount = this.quotaCount + quota

      let current = Date.now()

      if (this.timestamp === 0) {
         this.timestamp = current
      }

      let delay = current - this.timestamp

      if (delay > MsPerDay) {
         console.log(`Daily quota time period has been reset. Adding ${this.quotaPerDay} quota for the day.`)
         this.quotaPerDayCount = 0
      }

      if (this.quotaPerDayCount > this.quotaPerDay) {
         console.log(`Maximum Quota has been hit for the day. Waiting for the 24 hour period to restart`)
         return {
            results: undefined,
            run: false
         }
      }

      if (delay > 1000) {
         this.timestamp = current
         this.quotaCount = 0
         newQuotaCount = this.quotaCount + quota
      }

      if (newQuotaCount < this.quotaPerSecond) {
         this.quotaCount = newQuotaCount
         this.quotaPerDayCount += quota

         try {
            let results = await fn()
            return { results, run: true }
         } catch (err) {
            if (err.code === 403 && err.message.startsWith(`Quota exceeded for quota metric`)) {
               //console.log(`!! Quota Exceeded. Continuing as usual.`)
               return {
                  results: undefined,
                  run: false
               }
            } else {
               throw err
            }
         }
      } else {
         return {
            results: undefined,
            run: false
         }
      }
   }
}

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
async function until<TResult>(
   task: () => Promise<TResult>,
   verify: (result: TResult) => boolean,
   delayMs: number,
   retryCount: number
): Promise<void> {
   let done = false
   let retries = 0

   while (!done) {
      let result = await task()

      done = verify(result)

      if (done) {
         return Promise.resolve()
      }

      retries++

      if (retryCount != -1 && retries > retryCount) {
         return Promise.reject(new Error('Retry count exceeded'))
      }

      await delay(delayMs)
   }
}

/*------------------------------------------------------------------------
 * Waits the delay in ms before resolving a promise
 * @param {uint} ms Delay in ms
 /*---------------------------------------------------------------------*/
async function delay(ms: number): Promise<void> {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve()
      }, ms)
   })
}