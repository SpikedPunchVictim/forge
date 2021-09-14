import { Writable, WritableOptions } from 'readable-stream'
import { MultiError } from '../errors/MultiError'

/**
 * A WriteStream that can stream data between multiple
 * WriteStreams
 */
export class WriteToManyStream extends Writable {
   readonly streams: Writable[]
   readonly maxWriteAttempts: number

   constructor(streams: Writable[], options?: WritableOptions, maxWriteAttempts: number = 5) {
      super(options)
      this.streams = streams
      this.maxWriteAttempts = maxWriteAttempts

      // Flush the underlying streams when this stream is done
      let self = this
      this.on('finish', () => {
         for(let stream of self.streams) {
            stream.end()
         }
      })
   }

   _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void {
      let attemptCount = new Map<Writable, number>()
      let doneCount = 0
      let multi: MultiError = new MultiError()

      let cb = (error?: Error | null) => {
         // When an error occurs, we wait until
         // all of the streams are done processing
         // this request.
         if(error) {
            multi.errors.push(error)
         }

         doneCount++

         if(doneCount == this.streams.length) {
            if(multi.length > 0) {
               callback(multi)
            } else {
               callback()
            }
         }
      }

      let drain = (stream: Writable) => {
         attemptWrite(stream)
      }

      let attemptWrite = (stream: Writable) => {
         let count = attemptCount.get(stream)

         if(count === undefined) {
            attemptCount.set(stream, 1)
         } else {
            attemptCount.set(stream, ++count)
         }

         if(stream.write(chunk, encoding, cb) == false) {
            stream.once('drain', () => drain(stream))
         }
      }

      for(let stream of this.streams) {
         attemptWrite(stream)
      }
   }
}