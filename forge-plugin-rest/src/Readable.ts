import { Readable } from "readable-stream"
import { RestOptions } from "./RestOptions"
import got from 'got'

export class RestReadableStream extends Readable {
   readonly options: RestOptions
   private stream: Readable

   constructor(options: RestOptions) {
      super({
         encoding: 'utf8'
      })
      this.options = options
   }

   _read(): void {
      try {
         let req = this.options.requests.shift()

         if (req === undefined) {
            this.push(null)
            return
         }

         // trim forward slashes
         while(req.path.startsWith('/')) {
            req.path = req.path.slice(1)
         }

         let uri = this.options.url === undefined ?
            req.path :
            `${this.options.url}/${req.path}`

         got[req.verb](uri, this.options.gotOptions)
            .then(res => {
               if(this.options.debug) {
                  console.dir(res.body, { depth: null })
               }

               this.push(res.body)
            })
            .catch(err => {
               this.destroy(err)
            })
      } catch (err) {
         this.destroy(err)
      }
   }
}