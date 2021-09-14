

export class MultiError extends Error {
   readonly errors: Error[] = new Array<Error>()

   get length(): number {
      return this.errors.length
   }

   constructor(errors?: Error | Error[]) {
      super()

      if(errors) {
         if(!Array.isArray(errors)) {
            errors = [errors]
         }
   
         this.errors = errors
      }
   }

   * [Symbol.iterator]() {
		for (const error of this.errors) {
			yield error;
		}
	}
}