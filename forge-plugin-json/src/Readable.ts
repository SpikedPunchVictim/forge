import { Readable } from 'readable-stream'
import * as fs from 'fs-extra'
import Parser from 'stream-json/Parser'

/**
 * This class represents a JSON stream that streams full Objects
 */
export class JsonObjectReadStream extends Readable {
   readonly files: string[]

   constructor(files: string[]) {
      super({
         objectMode: true,
         encoding: 'utf8'
      })

      this.files = files
   }

   _read(): void {
      try {
         let file = this.files.shift()

         if (file === undefined) {
            this.push(null)
            return
         }

         fs.readJson(file, (err, obj) => {
            this.push(obj)
         })

      } catch (err) {
         this.emit('error', err)
      }
   }
}

/**
 * This class implements a Readable stream that streams chunks
 */
export class JsonChunkReadStream extends Readable {
   readonly files: string[]
   private stream: Readable | undefined = undefined
   private parser: Parser | undefined

   private get isStreaming(): boolean {
      return this.stream !== undefined
   }

   constructor(files: string[]) {
      super({
         objectMode: true,
         encoding: 'utf8'
      })

      this.files = files
   }

   _read(): void {
      if (!this.isStreaming) {
         let file = this.files.shift()

         if (file === undefined) {
            this.push(null)
            return
         }

         this.stream = fs.createReadStream(file, { encoding: 'utf8' })
         this.parser = new Parser()

         this.parser.on('data', (chunk: any) => {
            this.emit('data', chunk)
         })

         this.parser.on('end', () => {
            this.emit('end')
            this.parser.removeAllListeners()
            this.stream = undefined
            this.parser = undefined
         })

         this.parser.on('error', err => this.emit('error', err))
         this.parser.on('pause', () => this.emit('pause'))
         this.parser.on('resume', () => this.emit('resume'))
         this.parser.on('readable', () => this.emit('readable'))
      }
   }
}

/**
 * This class implements a SAX-like JSON stream
 */
export class JsonSaxReadStream extends Readable {
   readonly files: string[]
   private stream: Readable | undefined = undefined

   private get isStreaming(): boolean {
      return this.stream !== undefined
   }

   constructor(files: string[]) {
      super({
         objectMode: true,
         encoding: 'utf8'
      })

      this.files = files
   }

   _read(): void {
      if (!this.isStreaming) {
         let file = this.files.shift()

         if (file === undefined) {
            this.push(null)
            return
         }

         this.stream = fs.createReadStream(file, { encoding: 'utf8' })

         if(this.stream === undefined) {
            throw new Error(`Failed to create a Read stream for file ${file}. Ensure it exsists, and that the path is correct.`)
         }

         this.stream.on('data', (chunk: any) => {
            this.emit('data', chunk)
         })

         this.stream.on('end', () => {
            this.emit('end')
            this.stream?.removeAllListeners()
            this.stream = undefined
         })

         this.stream.on('error', err => this.emit('error', err))
         this.stream.on('pause', () => this.emit('pause'))
         this.stream.on('resume', () => this.emit('resume'))
         this.stream.on('readable', () => this.emit('readable'))
      }
   }
}