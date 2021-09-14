export interface IDefer<T> {
   promise: Promise<T>
   resolve: (value?: T | PromiseLike<T> | undefined) => void
   reject: (err: Error) => void
}

/*------------------------------------------------------------------------
 * Creates a deferred promise.
 *
 * Note:
 *    This is used in situations when creating user facing methods, want
 *    defer the running of a custom function (ie apply()), or memoization.
 /*---------------------------------------------------------------------*/
 export function defer<T>(): IDefer<T> {
   let defer = {} as IDefer<T>

   defer.promise = new Promise<T>((resolve, reject) => {
      defer.resolve = resolve
      defer.reject = reject
   })

   return defer
}

/*------------------------------------------------------------------------
 * Runs a series of promises in sequence
 * 
 * @param {Array|function():Promise} promises
 *    An Array of parameterless methods that return Promises will be run in sequence
 /*---------------------------------------------------------------------*/
 export function sequence(promises: Array<() => Promise<any>> /*| () => Promise<any>*/) {
   if(promises == null) {
      return Promise.resolve()
   }

   // if(!Array.isArray(promises)) {
   //    return Promise.resolve(promises)
   //       .then(value => value)
   // }

   return promises.reduce((p, curr) => {
      return p.then(_ => curr())
   }, Promise.resolve())
}

