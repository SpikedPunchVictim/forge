import {
   IBuildState,
   IEnvoy,
   IPlugin,
   IStep,
   StepInfo } from '@spikedpunch/forge'

import { Swig, SwigOptions } from 'swig'
import { Readable, Writable, Transform } from 'readable-stream'
import { SwigTransformStream } from './Transform'
import { SwigPluginOptions } from './SwigPluginOptions'

export class SwigEnvoy implements IEnvoy {
   data: any
   metadata: any
   readonly options: SwigPluginOptions
   readonly swig: Swig

   constructor(options: SwigPluginOptions) {
      this.options = options
      this.swig = new Swig(this.options.swigOptions)
   }

   /**
    * Creates a Swig object
    * 
    * @param options The Swig Options
    */
   createSwig(options?: SwigOptions): Swig {
      return new Swig(options)
   }

   /**
    * Renders a string based on the SwigOptions that are set in the 'options' property.
    * 
    * @param template The template string
    * @param data The data context
    */
   render(template: string, data: any): string {
      return this.swig.render(template, {
         ...this.options.swigOptions,
         locals: data
      })
   }
}

export class SwigPlugin implements IPlugin {
   readonly name: string = 'forge-swig-plugin'
   readonly url: string

   constructor() {
   }

   // async createEnvoy(state: IBuildState, info: StepInfo): Promise<IEnvoy> {
   //    let options = await SwigPluginOptions.fromStep(state, info)
   //    return new SwigEnvoy(options)
   // }

   async read(state: IBuildState, step: IStep): Promise<Readable> {
      throw new Error('Readable streams are not supported by the swig plugin')
   }

   async write(state: IBuildState, step: IStep): Promise<Writable> {
      let options = await SwigPluginOptions.fromStep(state, step.info)
      return new SwigTransformStream(state, options)
   }

   async transform(state: IBuildState, step: IStep): Promise<Transform> {
      let options = await SwigPluginOptions.fromStep(state, step.info)
      return new SwigTransformStream(state, options)
   }
}