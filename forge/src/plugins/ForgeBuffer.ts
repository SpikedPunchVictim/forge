import { Readable, Transform, Writable } from 'readable-stream'
import { IPlugin } from "./IPlugin"
import { IBuildState } from '../core/BuildState'
import { IStep, StepInfo } from "../core/Step"
import { BufferStream } from '../streams'

class ForgeBufferOptions {
   object: boolean = false
   size: number = 1024

   constructor() {

   }

   static fromStep(info: StepInfo): ForgeBufferOptions {
      let options = new ForgeBufferOptions()

      if(info.object != null) {
         if(typeof info.object !== 'boolean') {
            throw new Error(`Encountered the wrong type for an 'object' property for a forge:buffer step. Expected 'boolean', but received a ${typeof info.object} instead`)
         }

         options.object = info.object
      }

      if(info.size != null) {
         if(typeof info.size !== 'number') {
            throw new Error(`Encountered the wrong type for an 'size' property for a forge:buffer step. Expected 'number', but received a ${typeof info.size} instead`)
         }

         options.size = info.size
      }

      return options
   }
}

export class ForgeBuffer implements IPlugin {
   static readonly type: string = 'forge-internal-buffer-plugin'
   readonly name: string = ForgeBuffer.type

   read(state: IBuildState, step: IStep): Promise<Readable> {
      throw new Error(`${ForgeBuffer.type} does not support read streams`)
   }

   async write(state: IBuildState, step: IStep): Promise<Writable> {
      let options = ForgeBufferOptions.fromStep(step.info)

      let streamOptions = step.info.streamOptions == null ? { } : step.info.streamOptions

      if(options.object != null) {
         streamOptions.objectMode = options.object
      }

      return new BufferStream(options.size, streamOptions)
   }

   async transform(state: IBuildState, step: IStep): Promise<Transform> {
      let options = ForgeBufferOptions.fromStep(step.info)

      let streamOptions = step.info.streamOptions == null ? { } : step.info.streamOptions

      if(options.object != null) {
         streamOptions.objectMode = options.object
      }

      return new BufferStream(options.size, streamOptions)
   }
}