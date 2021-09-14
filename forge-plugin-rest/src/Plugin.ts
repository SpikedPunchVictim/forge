import {
   IBuildState,
   IEnvoy,
   IPlugin,
   IStep,
   StepInfo } from '@spikedpunch/forge'

import { Readable, Writable, Transform } from 'readable-stream'
import { RestReadableStream } from './Readable'
import { RestWritableStream } from './Writable'
import { RestOptions } from './RestOptions'
import { RestVerb, sanitizeUrl } from './Utils'

export type RequestEntry = {
   verb: RestVerb
   path: string
}

export class RestEnvoy implements IEnvoy {
   data: any
   metadata: any
   readonly url: string

   constructor(options: RestOptions) {
      this.url = sanitizeUrl(options.url)
   }
}

export type RestPluginOptions = {
   gotOptions?: any
}

export class RestPlugin implements IPlugin {
   readonly name: string = 'forge-plugin-rest'
   readonly url: string | undefined
   readonly options: RestPluginOptions

   constructor(url?: string, options?: RestPluginOptions) {
      this.url = url == null ? undefined : sanitizeUrl(url)
      this.options = options || {} 
   }

   // async createEnvoy(state: IBuildState, info: StepInfo): Promise<IEnvoy> {
   //    let options = RestOptions.fromStep(this.url, info, this.options.gotOptions)
   //    return new RestEnvoy(options)
   // }

   async read(state: IBuildState, step: IStep): Promise<Readable> {
      let options = RestOptions.fromStep(this.url, step.info, this.options.gotOptions)
      return new RestReadableStream(options)
   }

   async write(state: IBuildState, step: IStep): Promise<Writable> {
      let options = RestOptions.fromStep(this.url, step.info, this.options.gotOptions)
      return new RestWritableStream(options)
   }

   transform(state: IBuildState, step: IStep): Promise<Transform> {
      throw new Error(`Method not implemented. alias: ${step.alias}`)
   }
}