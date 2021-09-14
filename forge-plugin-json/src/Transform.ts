import { Transform } from "readable-stream";
import { JsonWritableStream } from "./Writable";


export class JsonTransformStream extends Transform {
   private writeFileStream: JsonWritableStream | undefined
   private cache: string

   constructor(outFile?: string) {
      super()

      if (outFile != null) {
         this.writeFileStream = new JsonWritableStream(outFile)
      }

      this.cache = ''
   }

   _transform(chunk: any, encoding: string, callback: (error?: Error | undefined, data?: any) => void): void {
      let next = (err: Error | null | undefined) => {
         if(err) {
            return callback(err, null)
         }

         try {
            if(encoding === 'buffer') {
               chunk = Buffer.from(chunk).toString('utf8')
            }

            this.cache += chunk
            callback()
         } catch (err) {
            callback(err)
         }
      }

      if (this.writeFileStream !== undefined) {
         this.writeFileStream.write(chunk, next)
      } else {
         next(null)
      }
   }

   _final(callback: (error?: Error | undefined, data?: any) => void): void {
      callback(undefined, this.cache)
   }
}