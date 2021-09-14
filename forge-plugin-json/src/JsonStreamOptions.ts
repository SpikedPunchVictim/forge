import { IBuildState, StepInfo } from "@spikedpunch/forge"
import { StreamMode } from "./Plugin"
const path = require('path')

export class JsonStreamOptions {
   files: string[]
   outFile: string
   mode: StreamMode
   space: number

   constructor(
      files: string[] = new Array<string>(),
      outFile: string = '',
      mode: StreamMode = StreamMode.Object,
      space: number = 0
   ) {
      this.files = files
      this.outFile = outFile
      this.mode = mode
      this.space = space
   }

   static async fromStep(state: IBuildState, info: StepInfo): Promise<JsonStreamOptions> {
      let options = new JsonStreamOptions()

      if (info.files) {
         if (!Array.isArray(info.files)) {
            if (typeof info.files !== 'string') {
               throw new Error(`The 'files' field in a Json Step is incorrect. Expecting a 'string' or a 'string[]', but instead got ${typeof info.fields}`)
            }
         }

         options.files = await state.toAbsolute(info.files)
      }

      if (info.mode) {
         if (typeof info.mode === 'string') {
            switch (info.mode.toLowerCase()) {
               case 'object': {
                  options.mode = StreamMode.Object
                  break
               }
               case 'sax': {
                  options.mode = StreamMode.Sax
                  break
               }
               case 'chunk': {
                  options.mode = StreamMode.Chunk
                  break
               }
               default: {
                  throw new Error(`Encoutnered unknown 'mode' (${info.mode}) when parsing a JSON step.`)
               }
            }
         } else {
            info.mode = StreamMode.Object
         }
      }

      if (info.outFile) {
         if (typeof info.outFile !== 'string') {
            throw new Error(`The 'outFile' specified in a Json step is invalid. It's expected to be a 'string' but got a ${typeof info.outFile} instead.`)
         }

         options.outFile = path.join(state.cwd, info.outFile)
      }

      if(info.space) {
         if(typeof info.space !== 'number') {
            throw new Error(`The 'space' specified in a Json step is invalid. It's expected to be a 'number' but got a ${typeof info.space} instead.`)
         }

         options.space = info.space
      }

      return options
   }
}