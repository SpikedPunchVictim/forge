import {
   IBuildState,
   IPlugin,
   IStep
} from '@spikedpunch/forge'

import { Readable, Writable, Transform } from 'readable-stream'
import { JsonChunkReadStream, JsonObjectReadStream, JsonSaxReadStream } from './Readable'
import { JsonWritableStream } from './Writable'
import { JsonStreamOptions } from './JsonStreamOptions'
import { JsonTransformStream } from './Transform'

export enum StreamMode {
   Object = 0,
   Sax = 1,
   Chunk = 2
}

/**
 * 
 */
export class JsonPlugin implements IPlugin {
   readonly name: string = 'forge-plugin-json'

   constructor() {

   }

   // async createEnvoy(state: IBuildState, info: StepInfo): Promise<IEnvoy> {
   //    let options = await JsonStreamOptions.fromStep(state, info)
   //    return new JsonEnvoy(options)
   // }

   async read(state: IBuildState, step: IStep): Promise<Readable> {
      let options = await JsonStreamOptions.fromStep(state, step.info)

      switch (options.mode) {
         case StreamMode.Chunk: {
            return new JsonChunkReadStream(options.files)
         }
         case StreamMode.Object: {
            return new JsonObjectReadStream(options.files)
         }
         case StreamMode.Sax: {
            return new JsonSaxReadStream(options.files)
         }
         default: {
            throw new Error(`Unsupported 'mode' encoutnered when processing a JSON step.`)
         }
      }
   }

   async write(state: IBuildState, step: IStep): Promise<Writable> {
      let options = await JsonStreamOptions.fromStep(state, step.info)
      return new JsonWritableStream(options.outFile)
   }

   async transform(state: IBuildState, step: IStep): Promise<Transform> {
      let options = await JsonStreamOptions.fromStep(state, step.info)
      return new JsonTransformStream(options.outFile)
   }
}