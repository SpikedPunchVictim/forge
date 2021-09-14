import { Readable, Transform, Writable } from 'readable-stream'
import { IPlugin } from "./IPlugin"
import { IBuildState } from '../core/BuildState'
import { IStep, StepInfo } from "../core/Step"
class ForgeStreamOptions {
   stream: Readable | Writable | Transform | undefined = undefined

   constructor() {

   }

   static fromStep(info: StepInfo): ForgeStreamOptions {
      let options = new ForgeStreamOptions()

      if(info.stream == null) {
         throw new Error(`Missing 'stream' property on a forge:stream step (${info.alias}).`)
      }

      options.stream = info.stream

      return options
   }
}

export class ForgeStream implements IPlugin {
   static readonly type: string = 'forge-internal-stream-plugin'
   readonly name: string = ForgeStream.type

   async read(state: IBuildState, step: IStep): Promise<Readable> {
      let options = ForgeStreamOptions.fromStep(step.info)
      return options.stream as Readable
   }

   async write(state: IBuildState, step: IStep): Promise<Writable> {
      let options = ForgeStreamOptions.fromStep(step.info)
      return options.stream as Writable
   }

   async transform(state: IBuildState, step: IStep): Promise<Transform> {
      let options = ForgeStreamOptions.fromStep(step.info)
      return options.stream as Transform
   }
}