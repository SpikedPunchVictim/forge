import { Readable, Writable, Transform, TransformOptions } from 'readable-stream'
import { IPlugin } from "./IPlugin"
import { IBuildState } from '../core/BuildState'
import { IStep, StepInfo } from "../core/Step"

type WriteFn = (chunk: any, encoding: string) => Promise<any>
type ReadFn = (size: number) => AsyncGenerator<any>

async function NoOpWrite(chunk: any, encoding: string): Promise<any> {
   return chunk
}

async function* NoOpRead(size: number): AsyncGenerator<any> {
   yield
}

class ForgeFnOptions {
   fn: WriteFn | ReadFn | undefined = undefined
   object: boolean = true

   constructor() {

   }

   /**
    * Normalizes the Step information into a ForgeFnOptions object.
    * 
    * @param info The step info 
    * @returns ForgeFnOptions
    */
   static fromStep(info: StepInfo): ForgeFnOptions {
      /*
         {
            alias: '',
            plugin: ':fn',
            fn: async (chunk, encoding) => { },
            object?: boolean
         }
      */
      let options = new ForgeFnOptions()

      if(info.fn != null) {
         if(typeof info.fn !== 'function') {
            throw new Error(`Encountered the wrong type for an 'fn' property for a forge:fn step. Expected 'function', but received a ${typeof info.fn} instead`)
         }

         options.fn = info.fn
      }

      options.object = info.object || true

      return options
   }
}

export class ForgeFn implements IPlugin {
   static readonly type: string = 'forge-internal-fn-plugin'
   readonly name: string = ForgeFn.type

   createStream(step: IStep): Transform {
      let options = ForgeFnOptions.fromStep(step.info)

      if(options.fn === undefined) {
         options.fn = NoOpWrite
      }

      let streamOptions: TransformOptions = step.info.streamOptions || {}
      streamOptions.objectMode = options.object

      return new Transform({
         async transform(chunk: any, encoding: string, callback) {
            if(options.fn == null) {
               return callback()
            }

            try {
               callback(undefined, await options.fn(chunk, encoding))
            } catch(err) {
               callback(err)
            }
         },
         ...streamOptions
      })
   }

   async read(state: IBuildState, step: IStep): Promise<Readable> {
      let options = ForgeFnOptions.fromStep(step.info)

      if(options.fn === undefined) {
         options.fn = NoOpRead
      }

      let streamOptions = step.info.streamOptions || {}
      streamOptions.objectMode = options.object

      return new Readable({
         async read(size: number) {
            if(options.fn == null) {
               this.push(null)
               return
            }

            try {
               let cast = options.fn as ReadFn

               for await(let res of cast(size)) {
                  this.push(res)
               }
   
               this.push(null)
            } catch(err) {
               this.destroy(err)
            }
         },
         ...streamOptions
      })
   }

   async write(state: IBuildState, step: IStep): Promise<Writable> {
      return this.createStream(step)
   }

   async transform(state: IBuildState, step: IStep): Promise<Transform> {
      return this.createStream(step)
   }
}