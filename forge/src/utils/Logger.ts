
export interface ILogger {
   error: (message: string) => void
   log: (message: string) => void
   info: (message: string) => void
   verbose: (message: string) => void
   warn: (mesage: string) => void
}

class EmptyLoggerClass implements ILogger {
   error(message: string, ...optionalParams: any[]) {

   }

   log(message: string, ...optionalParams: any[]) {

   }

   info(message: string, ...optionalParams: any[]) {

   }

   verbose(message: string, ...optionalParams: any[]) {

   }

   warn(message: string, ...optionalParams: any[]) {

   }
}

export const EmptyLogger = new EmptyLoggerClass()

export class ConsoleLogger implements ILogger {
   error(message: string, ...optionalParams: any[]) {
      console.log(message, optionalParams)
   }

   log(message: string, ...optionalParams: any[]) {
      console.log(message, optionalParams)
   }

   info(message: string, ...optionalParams: any[]) {
      console.info(message, optionalParams)
   }

   verbose(message: string, ...optionalParams: any[]) {
      console.trace(message, optionalParams)
   }

   warn(message: string, ...optionalParams: any[]) {
      console.warn(message, optionalParams)
   }
}
