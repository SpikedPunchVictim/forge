type ValidateTypeHandler = (value: any) => boolean

export type KeyValueType = {
   [key: string]: string | ValidateTypeHandler
}

export type ObjectValidateMap = {
   required?: KeyValueType,
   optional?: KeyValueType,
   mutex?: KeyValueType[]
}

enum ValidateFailReason {
   NotFound = 'not-found',
   WrongType = 'wrong-type',
   MutexDuplicate = 'mutex-duplicate'
}

// Optimization for precompiled Regex
const NameValidatidationRegex = /[^a-zA-Z0-9-_]/g

export class InvalidNameError extends Error {
   constructor(name: string) {
      super(`${name} is not a valid name. It must match the regex /[^a-zA-Z0-9-_]/g`)
   }
}

/**
 * Represents the results of a validation run
 */
export class ValidationResult {
   get success(): boolean {
      for(let list of this.errors.values()) {
         if(list.length > 0) {
            return false
         }
      }

      return true
   }

   readonly map: ObjectValidateMap

   private errors: Map<string, string[]>
   
   constructor(map: ObjectValidateMap) {
      this.map = map

      this.errors = new Map<string, string[]>()

      // Initialize the Map
      for(let reason of Object.values(ValidateFailReason)) {
         this.errors.set(reason, new Array<string>())
      }
   }

   requiredNotFound(key: string): void {
      let keys = this.errors.get(ValidateFailReason.NotFound)
      keys?.push(key)
   }

   requiredFailedValidation(key: string): void {
      let keys = this.errors.get(ValidateFailReason.WrongType)
      keys?.push(key)
   }

   requiredWrongType(key: string): void {
      let keys = this.errors.get(ValidateFailReason.WrongType)
      keys?.push(key)
   }

   mutexDuplicate(key: string): void {
      let keys = this.errors.get(ValidateFailReason.MutexDuplicate)
      keys?.push(key)
   }

   expect(): string {
      let results = ``

      if(this.map.required != null) {
         results += `The required fields: ` 
         
         let count = 0
         for(let key of Object.keys(this.map.required)) {
            results += `${count++ > 0 ? ', ' : ''}${key}`
         }

         results += '. '
      }

      if(this.map.optional != null) {
         results += `The optional fields: `

         let count = 0
         for(let key of Object.keys(this.map.optional)) {
            results += `${count++ > 0 ? ', ' : ''}${key}`
         }

         results += '. '
      }

      if(this.map.mutex != null) {
         results += `The mutually exclusive fields: `

         for(let mutex of this.map.mutex) {
            let found = new Array<string>()
            for(let key of Object.keys(mutex)) {
               found.push(key)
            }

            results += `[${found.join(',')}] `
         }
      }

      return results
   }
}

export class Validate {
   static resourceName(name: string): void {
      if(name == null) {
         throw new InvalidNameError(name)
      }

      if(name == null || NameValidatidationRegex.test(name)) {
         throw new InvalidNameError(name)
      }
   }

   /**
    * Validates an Object
    * 
    * Example usage:
    * 
    *    Validate.object(obj, {
    *       required: {
    *          some: 'string'
    *          count: 'numbner',
    *          special: (value) => {
    *             // return true if the value is valid, otherwise false
    *          }
    *       },
    *       // We ignore optional values, but we declare them so we can include
    *       // them in any error messages. This helps inform the user.
    *       optional: {
    *          optional: 'string',
    *          dontneedme: 'number'
    *       },
    *       // Mutually exclusive properties
    *       mutex: [
    *          {
    *             sourcePath: 'string',
    *             sourceId: 'string'
    *          },
    *          {
    *             parentPath: 'string',
    *             parentId: 'string'
    *          }
    *       ]
    *     })
    * 
    * @param obj The Object to validate
    * @param map The validatrion map containing the expected structure
    */
   static object(obj: any, map: ObjectValidateMap): ValidationResult {
      let result = new ValidationResult(map)

      let testType = (key: string, value: string, type: string | ValidateTypeHandler): void => {
         if(typeof type === 'function') {
            if(!type(value)) {
               result.requiredFailedValidation(key)
               return
            }
         } else if (typeof value !== type) {
            result.requiredWrongType(key)
            return
         }
      }

      if(map.required != null) {
         for(let key of Object.keys(map.required)) {
            if (obj[key] == null) {
               result.requiredNotFound(key)
               continue
            }

            testType(key, obj[key], map.required[key])
         }
      }

      if(map.mutex != null) {
         for(let mutex of map.mutex) {
            let found = new Array<string>()

            for(let key of Object.keys(mutex)) {
               if(obj[key] != null) {
                  found.push(key)
                  testType(key, obj[key], mutex[key])
               }
            }

            if(found.length > 1) {
               found.forEach(k => result.mutexDuplicate(k))
            }
         }
      }

      return result
   }

   static enum(enm: any): ValidateTypeHandler {
      return (value: any) => {
         for(let enumValue of Object.values(enm)) {
            if(value === enumValue) {
               return true
            }
         }
   
         return false
      }
   }

   /**
    * Creates a method to validate a nested object
    * 
    * @param map The Validation Map
    */
   static obj(map: ObjectValidateMap): ValidateTypeHandler {
      return (value: any): boolean => {
         let result = Validate.object(value, map)
         return result.success
      }
   }
}