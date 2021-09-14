import { Writable } from 'readable-stream'
import * as fs from 'fs-extra'

export class JsonWritableStream extends Writable {
   readonly outFile: string
   readonly space: number
   private stream: Writable | undefined = undefined

   constructor(outFile: string, space: number = 0) {
      super({
         decodeStrings: false,
         defaultEncoding: 'utf8'
      })

      this.outFile = outFile
      this.space = space
   }

   _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void {
      if(encoding === 'buffer') {
         chunk = Buffer.from(chunk).toString('utf8')
      }
   
      if (this.stream === undefined) {
         fs.ensureFile(this.outFile, (err: Error) => {
            if(err) {
               return callback(err)
            }

            this.stream = fs.createWriteStream(this.outFile, {
               flags: 'r+',
               encoding: 'utf8'
            })

            if(this.stream === undefined) {
               throw new Error(`Failed to create a writable stream to file ${this.outFile}.`)
            }

            this.stream.write(chunk, callback)
         })
      } else {
         if(this.stream === undefined) {
            throw new Error(`Failed to create a writable stream to file ${this.outFile}.`)
         }
   
         this.stream.write(chunk, callback)
      }
   }

   _final(callback: (error?: Error | null) => void): void {
      if (this.stream !== undefined) {
         return this.stream.end(callback)
      }

      callback()
   }
}