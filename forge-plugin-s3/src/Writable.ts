/*
abortMultipartUpload
createMultipartUpload
completeMultipartUpload
uploadPart
*/

import { PassThrough, Writable, WritableOptions } from "readable-stream";
import { Credentials, S3 } from 'aws-sdk'
import { S3StepOptions } from "./S3StepOptions";

export class S3WritableStream extends Writable {
   readonly options: S3StepOptions
   private stream: PassThrough | undefined
   private s3: S3
   private promise: Promise<S3.ManagedUpload.SendData> | undefined = undefined

   constructor(stepOptions: S3StepOptions, options?: WritableOptions) {
      super({
         highWaterMark: 8388608, // 8MB
         ...(options || {})
      })

      this.options = stepOptions

      this.s3 = new S3({
         credentials: new Credentials({
            accessKeyId: this.options.accessKeyId || '',
            secretAccessKey: this.options.secretAccessKey || ''
         })
      })
   }

   _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void {
      try {
         let attemptCount = 0

         if (this.stream === undefined) {
            this.stream = new PassThrough()

            this.stream.on('close', () => this.emit('close'))
            this.stream.on('error', (err) => this.emit('error', err))

            let s3Options = this.options.s3Options || {}

            this.promise = this.s3.upload({
               Bucket: this.options.bucket,
               Key: this.options.key,
               Body: this.stream,
               ...s3Options
            }).promise()
         }

         let cb = (error?: Error | null) => {
            // When an error occurs, we wait until
            // all of the streams are done processing
            // this request.
            if (error) {
               callback(error)
            } else {
               callback()
            }
         }

         let drain = (stream: Writable) => {
            attemptWrite(stream)
         }

         let attemptWrite = (stream: Writable) => {
            ++attemptCount

            if (attemptCount > 5) {
               return callback(new Error(`Too many attempts performed while retrying to write to the S3 bucket. Step with S3 bucket key ${this.options.key}`))
            }

            // This should never happen. It helps appease the Typescript Gods
            if (this.stream == undefined) {
               return callback(new Error(`Internal S3 writable stream failed to initialize for step with S3 bucket key ${this.options.key}`))
            }

            if (this.stream.write(chunk, cb) == false) {
               stream.once('drain', () => drain(stream))
            }
         }

         attemptWrite(this.stream)
      } catch (err) {
         callback(err)
      }
   }

   async _final(cb: (error?: Error | null) => void) {
      if(this.promise === undefined) {
         return cb()
      }

      this.stream?.end()
      await this.promise
      cb()
   }
}