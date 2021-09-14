import { Transform, TransformOptions } from 'readable-stream'

enum BufferEncoding {
   NotSet = 'not-set',
   Buffer = 'buffer',
   Object = 'object',
   String = 'string'
}

export class BufferStream extends Transform {
   readonly size: number

   private buffer: any[] | Uint8Array | string | undefined = undefined
   private bufferEncoding: BufferEncoding
   
   get objectMode(): boolean {
      return this._writableState.objectMode
   }

   constructor(size: number = -1, options?: TransformOptions) {
      super(options)
      this.size = size
      this.bufferEncoding = BufferEncoding.NotSet
   }

   _transform(chunk: any, encoding: string, cb: (error?: Error | undefined, data?: any) => void): void {
      if(this.buffer === undefined) {
         if(this.objectMode) {
            this.buffer = new Array<any>()
            this.bufferEncoding = BufferEncoding.Object
         } else if(encoding === 'string') {
            this.buffer = ''
            this.bufferEncoding = BufferEncoding.String
         } else if(encoding === 'buffer') {
            this.buffer = chunk
            this.bufferEncoding = BufferEncoding.Buffer

            let cast = this.buffer as Buffer

            if(cast.length >= this.size) {
               cb(undefined, cast)
               this.buffer = Buffer.alloc(0)
            }

            return
         } else {
            throw new Error(`Unsupported encoding type encountered witht he Forge Buffer Stream`)
         }
      }

      // Should never get here
      if(this.buffer === undefined) {
         throw new Error(`'buffer' has not been initialized properly in the ForgeBufferStream`)
      }

      switch(this.bufferEncoding) {
         case BufferEncoding.Buffer: {
            this.buffer = Buffer.concat(chunk)

            if(this.size != -1 && this.buffer.byteLength >= this.size) {
               cb(undefined, this.buffer)
               this.buffer = Buffer.alloc(0)
            } else {
               cb()
            }

            break
         }
         case BufferEncoding.Object: {
            let cast = this.buffer as Array<any>

            cast.push(chunk)
   
            if(this.size != -1 && cast.length >= this.size) {
               cb(undefined, cast)
               cast.splice(0, Math.max(0, cast.length - 1))
            } else {
               cb()
            }

            break
         }
         case BufferEncoding.String: {
            let cast = this.buffer as string
            cast += chunk
   
            if(this.size != -1 && cast.length >= this.size) {
               cb(undefined, cast)
               cast = ''
            } else {
               cb()
            }

            break
         }
         default: {
            cb()
         }
      }
   }

   _flush(cb: (error?: Error | undefined, data?: any) => void) {
      try {
         switch(this.bufferEncoding) {
            case BufferEncoding.Buffer: {
               let cast = this.buffer as Buffer

               if(cast.byteLength > 0) {
                  cb(undefined, cast)
                  this.buffer = Buffer.alloc(0)
               }

               break
            }
            case BufferEncoding.Object: {
               let cast = this.buffer as Array<any>
               
               if(cast.length > 0) {
                  cb(undefined, cast)
                  cast.splice(0, Math.max(0, cast.length))
               }

               break
            }
            case BufferEncoding.String: {
               let cast = this.buffer as string

               if(cast.length > 0) {
                  cb(undefined, cast)
                  this.buffer = ''
               }
               
               break
            }
            default: {
               cb()
            }
         }
      } catch(err) {
         cb(err)
      }
   }
}