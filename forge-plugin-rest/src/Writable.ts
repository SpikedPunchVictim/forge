import { Writable } from "readable-stream";
import { RestOptions } from "./RestOptions";
import got from 'got'

export class RestWritableStream extends Writable {
   readonly options: RestOptions

   constructor(options: RestOptions) {
      super()
      if (this.options.requests.length == 0 ||
         this.options.requests.length > 1) {
         throw new Error(`One request is expected when writing to a URL`)
      }

      this.options = options
   }

   _write(chunk: any, encoding: string, cb: (error?: Error | null) => void): void {
      // For write, we expect to have 1 item in the requests Array
      let verb = this.options.requests[0].verb
      let path = this.options.requests[0].path

      got[verb](`${this.options.url}/${path}`, {
         body: chunk,
         ...this.options.gotOptions
      })
      .then(res => {
         if (this.options.debug) {
            console.dir(res.body, { depth: null })
         }

         this.write(res.body)
         cb()
      })
      .catch(err => {
         cb(err)
      })
   }
}