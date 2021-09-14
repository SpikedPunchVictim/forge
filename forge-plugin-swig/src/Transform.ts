import * as path from 'path'
import * as fs from 'fs-extra'
import { Transform } from 'readable-stream'
import { SwigPluginOptions } from './SwigPluginOptions'
import { SwigEnvoy } from './Plugin'
import { IBuildState } from '@spikedpunch/forge'

// const swig = require('swig-templates')

// type DataContext = {
//    [key:string]: any
// }

/*

export class MultiSourceTransformStream extends MultiSourceStream {
   constructor() {

   }

   _transform(chunk, encoding, cb) {

   }
}

*/

export class SwigTransformStream extends Transform {
   readonly state: IBuildState
   readonly options: SwigPluginOptions
   private envoy: SwigEnvoy
   private cache: string | Array<any> | undefined

   constructor(state: IBuildState, options: SwigPluginOptions) {
      super({
         defaultEncoding: 'utf8',
         objectMode: true
      })

      this.options = options
      this.envoy = new SwigEnvoy(options)
      this.state = state
      this.cache = undefined
   }

   _

   _transform(chunk: any, encoding: string, cb: (error?: Error | null, data?: any) => void): void {
      // TODO: Support multiple use sources
      // To do that, spawn a transform stream for each use, and store their results into a Map
      if(chunk instanceof Uint8Array) {
         chunk = Buffer.from(chunk).toString('utf8')
         this.cache = this.cache === undefined ? chunk : (this.cache + chunk)
      } else if(Array.isArray(chunk)) {
         //@ts-ignore
         this.cache = this.cache == null ? Array.from(chunk) : this.cache.concat(chunk)
      } else if(this.cache === undefined) {
         this.cache = chunk
      } else {
         this.cache += chunk
      }

      cb(null, chunk)
   }

   async _flush(cb: (error?: Error | null, data?: any) => void): Promise<void> {
      let use = this.options.use || 'obj'

      try {
         let obj = {}

         if(Array.isArray(this.cache)) {
            obj = this.cache
         } else if (typeof this.cache === 'object') {
            obj = this.cache
         } else if(typeof this.cache === 'string') {
            obj = JSON.parse(this.cache)
         }

         let rendered = this.options.compile({ [use]: obj }, this.options.swigOptions)
   
         if(this.options.outFile) {
            await fs.ensureDir(path.dirname(this.options.outFile))
            await fs.writeFile(this.options.outFile, rendered, 'utf8')
         } else if(this.options.outFiles) {
            // (envoy: SwigEnvoy, state: IBuildState, data: any)
            await this.options.outFiles(this.envoy, this.state, this.cache)
         }

         cb(null, rendered)
      } catch(err) {
         cb(err)
      }
   }
}