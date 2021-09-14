import { Readable } from 'readable-stream'

export class NoOpReadStream extends Readable {
   constructor() {
      super()
   }

   _read() {
   }
}