import {
   IBuildState,
   StepInfo } from '@spikedpunch/forge'

import * as path from 'path'
import * as fs from 'fs-extra'
import { Swig, SwigOptions } from 'swig'
import { SwigEnvoy } from './Plugin'

export class SwigPluginOptions  {
   template: string
   use: string
   compile: (obj: any, opts?: SwigOptions) => string 
   outFile: string
   outFiles: (envoy: SwigEnvoy, state: IBuildState, data: any) => Promise<void>
   swigOptions: SwigOptions

   static async fromStep(state: IBuildState, info: StepInfo): Promise<SwigPluginOptions> {
      let options = new SwigPluginOptions()

      if(info.template && info.templateFile) {
         throw new Error(`For the swig step, 'template' and 'templateFile' are mutually exclusive. Ensure only one of them exists.`)
      }

      let swig = new Swig(info.options)

      options.swigOptions = info.options || {}
      options.swigOptions.autoescape = options.swigOptions.autoescape || false

      options.use = info.use

      if(info.templatFile) {
         if(typeof info.templatFile !== 'string') {
            throw new Error(`In a swig step, expected 'templatFile' to be a string, but got ${typeof info.templatFile} instead.`)
         }

         let found = await state.findFile(info.templateFile)

         if(found === undefined) {
            throw new Error(`Unable to find the swig templatFile ${info.templatFile}. Ensure it exists, and that a 'resolve' has been set for it.`)
         }

         options.template = await fs.readFile(found, 'utf8')
      }

      if(info.template) {
         if(typeof info.template !== 'string') {
            throw new Error(`In a swig step, expected 'template' to be a string, but got ${typeof info.template} instead.`)
         }

         options.template = info.template
      }

      if(info.outFile) {
         if(typeof info.outFile !== 'string') {
            throw new Error(`In a swig step, expected 'outFile' to be a string, but got ${typeof info.outFile} instead.`)
         }

         options.outFile = path.join(state.cwd, info.outFile)
      }

      if(info.outFiles) {
         if(typeof info.outFiles !== 'string' || typeof info.outFiles !== 'function') {
            throw new Error(`In a swig step, expected 'outFile' to be a string, but got ${typeof info.outFile} instead.`)
         }

         if(typeof info.outFiles === 'string') {
            let filePath = await state.findFile(info.outFiles)

            if(filePath == null) {
               throw new Error(`Could not find path to Swig 'outFiles' script ${info.outFiles}`)
            }

            options.outFiles = require(filePath)
         }

         if(typeof info.outFiles === 'function') {
            options.outFiles = info.outFiles
         }
      }

      options.compile = swig.compile(info.template, options.swigOptions)

      return options
   }

}