import { URL } from 'url'
import { Readable, ReadableOptions, Transform, Writable } from "readable-stream"
import { IBuildState } from "../core/BuildState"
import { IStep } from "../core/Step"
import { IPlugin } from "./IPlugin"
import * as http from "http"
import * as https from "https"
import { RequestOptions } from "https"

class HttpReadStream extends Readable {
   readonly requestOptions: RequestOptions

   constructor(requestOptions: RequestOptions, streamOptions: ReadableOptions) {
      super(streamOptions)
      this.requestOptions = requestOptions
   }

   _read(): void {
      let protocol = this.requestOptions.protocol == null ? 'https:' : this.requestOptions.protocol.toLowerCase()
      let httpProtocol = protocol === 'http:' ? http : https

      try {
         let req = httpProtocol.request(this.requestOptions, async (res) => {
            let chunks = new Array<any>()
            let length = 0
            let results: string | Buffer | undefined = undefined
            let rawBody: Buffer | undefined = undefined

            for await (let chunk of res) {
               chunks.push(chunk)
               length += Buffer.byteLength(chunk)
            }

            if (Buffer.isBuffer(chunks[0])) {
               rawBody = Buffer.concat(chunks, length)
            } else {
               rawBody = Buffer.from(chunks.join(''))
            }

            let contentType = res.headers['content-type'] || ''

            if (contentType.toLowerCase().indexOf('application/json') >= 0) {
               results = JSON.parse(rawBody.toString('utf8'))
            } else {
               results = rawBody
            }

            this.push(results)
            this.push(null)
         })

         req.end()
      } catch (err) {
         this.destroy(err)
      }
   }
}

// class HttpWriteStream extends Transform {
//    readonly requestOptions: RequestOptions

//    constructor(requestOptions: RequestOptions, streamOptions: TransformOptions) {
//       super(streamOptions)
//       this.requestOptions = requestOptions
//    }

//    _transform(chunk: any, encoding: string, cb: (error?: Error | undefined, data?: any) => void): void {
      
//    }
// }

export class ForgeHttpPlugin implements IPlugin {
   static readonly type: string = 'forge-internal-rest-plugin'
   readonly name: string = ForgeHttpPlugin.type


   /*
           protocol?: string | null;
           host?: string | null;
           hostname?: string | null;
           family?: number;
           port?: number | string | null;
           defaultPort?: number | string;
           localAddress?: string;
           socketPath?: string;
           method?: string;
           path?: string | null;
           headers?: OutgoingHttpHeaders;
           auth?: string | null;
           agent?: Agent | boolean;
           _defaultAgent?: Agent;
           timeout?: number;
           setHost?: boolean;
   */

   /*
      alias: '..',
      plugin: ':rest',
      verb: 'get' // post, put, delete,
      headers: {
         ...
      },
      // If set, puts the stream in Object Mode
      objectMode: true|false  // default true
      // These options override any previously set options
      options: // RequestOptions,
      streamOptions: {}    // ReadableOptions
   */

   /**
    * 
    * 
    * 
    * 
    * @param state 
    * @param step 
    * @returns 
    */
   async read(state: IBuildState, step: IStep): Promise<Readable> {
      let { info } = step
      let requestOptions: RequestOptions = {}
      let streamOptions: ReadableOptions = {}

      /*
         xform.options(info, {
            url: {
               type: 'string',
               exists: (url) => {
                  let url = new URL(info.url)
                  requestOptions.protocol = url.protocol
                  requestOptions.host = url.host
                  requestOptions.path = url.pathname
                  requestOptions.port = (url.port === '' || url.port == null) ? (
                     url.protocol === 'https:' ? 443 : 80
                  ) : url.port
               }
            },
            verb: {
               type: 'string',
               options: ['GET', 'POST', 'PUT', 'DELETE'],
               exists: verb => requestOptions.method = info.verb
               default: () => requestOptions.method = 'GET'
            },
            headers: {
               type: 'object',
               exists: headers => requestOptions.headers = info.headers
            },
            options: {
               type: 'object',
               exists: options => {
                  requestOptions = {
                     ...requestOptions,
                     ...info.options
                  }
               }
            },
            objectMode: {
               type: ['string', 'boolean'],
               exists: (objectMode, { switch }) => {
                  switch.type(objectMode)
                     .case('string', () => streamOptions.objectMode = info.objectMode.toLowerCase() === 'true')
                     .case('boolean', () => streamOptions.objectMode = info.objectMode)
                     .default(() => throw new Error())
               }
            }
         })

      */

      if (info.url != null) {
         let url = new URL(info.url)
         requestOptions.protocol = url.protocol
         requestOptions.host = url.host
         requestOptions.path = url.pathname
         requestOptions.port = (url.port === '' || url.port == null) ? (
            url.protocol === 'https:' ? 443 : 80
         ) : url.port
      }

      if (info.verb != null) {
         requestOptions.method = info.verb
      } else {
         requestOptions.method = 'GET'
      }

      if (info.headers != null) {
         requestOptions.headers = info.headers
      }

      if (info.options != null) {
         requestOptions = {
            ...requestOptions,
            ...info.options
         }
      }

      if(info.objectMode != null) {
         if(typeof info.objectMode === 'string') {
            streamOptions.objectMode = info.objectMode.toLowerCase() === 'true'
         } else if(typeof info.objectMode === 'boolean') {
            streamOptions.objectMode = info.objectMode
         } else {
            throw new Error(`'objectMode' is expected to be a string or a boolean. Received ${typeof info.objectMode} instead.`)
         }
      } else {
         streamOptions.objectMode = true
      }

      if(info.streamOptions != null) {
         streamOptions = {
            ...streamOptions,
            ...info.streamOptions
         }
      }

      return new HttpReadStream(requestOptions, streamOptions)
   }

   async write(state: IBuildState, step: IStep): Promise<Writable> {
      throw new Error(`No Envoy is supported for the ${ForgeHttpPlugin.type}`)
   }

   async transform(state: IBuildState, step: IStep): Promise<Transform> {
      throw new Error(`No Envoy is supported for the ${ForgeHttpPlugin.type}`)
   }
}