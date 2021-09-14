import {
   IBuildState,
   IEnvoy,
   IPlugin,
   IStep } from '@spikedpunch/forge'

import { Readable, Writable, Transform } from 'readable-stream'
import { config, Credentials, S3 } from 'aws-sdk'
import { S3StepOptions } from './S3StepOptions'
import { S3WritableStream } from './Writable'

export class S3Envoy implements IEnvoy {
   data: any
   metadata: any

   constructor() {

   }
}

export type S3PluginOptions = {
   accessKeyId?: string
   secretAccessKey?: string
   region?: string
   bucket?: string
   s3Options?: S3.ClientConfiguration
}

export class S3Plugin implements IPlugin {
   readonly name: string = 'forge-plugin-s3'
   readonly options: S3PluginOptions

   constructor(options?: S3PluginOptions) {
      this.options = options || {}

      // Global aws-sdk config
      config.apiVersions = {
         s3: '2006-03-01',
       }
   }

   // async createEnvoy(state: IBuildState, info: StepInfo): Promise<IEnvoy> {
   //    throw new Error('hh')
   // }

   async read(state: IBuildState, step: IStep): Promise<Readable> {
      let options = S3StepOptions.fromStep(step.info, this.options)

      let s3 = new S3({
         credentials: new Credentials({
            accessKeyId: this.options.accessKeyId || '',
            secretAccessKey: this.options.secretAccessKey || '',
            ...(options.s3Options || {})
         })
      })

      return s3
         .getObject({
            Bucket: options.bucket,
            Key: options.key
         }).createReadStream() as Readable
   }

   async write(state: IBuildState, step: IStep): Promise<Writable> {
      let options = S3StepOptions.fromStep(step.info, this.options)
      return new S3WritableStream(options)
   }

   transform(state: IBuildState, step: IStep): Promise<Transform> {
      throw new Error(`Method not implemented. alias: ${step.alias}`)
   }
}