import { S3 } from 'aws-sdk'
import { StepInfo } from '@spikedpunch/forge'
import { S3PluginOptions } from './Plugin'

export class S3StepOptions {
   bucket: string = ''
   key: string = ''
   accessKeyId?: string
   secretAccessKey?: string
   region?: string
   s3Options?: S3.ClientConfiguration

   static fromStep(info: StepInfo, options: S3PluginOptions): S3StepOptions {
      let stepOptions = new S3StepOptions()

      let either = (key: string) => {
         if(info[key] == null && options[key] == null) {
            throw new Error(`No '${key}' has been provided. '${key}' must be provided in the S3Plugin constructor or in the Step configuration.`)
         }

         stepOptions[key] = info[key] || options[key]
      }

      let step = (key: string) => {
         if(info[key] == null) {
            throw new Error(`No '${key}' has been provided. '${key}' must be provided in the Step configuration.`)
         }

         stepOptions[key] = info[key]
      }

      // Validate
      either('bucket')
      step('key')
      either('accessKeyId')
      either('secretAccessKey')
      either('region')

      stepOptions.s3Options = info.s3Options || undefined
  
      return stepOptions
   }
}