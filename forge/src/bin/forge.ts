#!/usr/bin/env node

/*
   TODO:
      - Add support for custom env variables in the forge file (ie ${customVariable}) that can be set from the command line/options

*/
//const program = require('commander')
import { program } from 'commander'
import { build, BuildRecord } from '../index'
const path = require('path')
const fs = require('fs-extra')
const resolve = require('resolve-dir')

const pkg = require(path.join(__dirname, '..', '..', 'package.json'))

program
   .version(pkg.version)
   .option('-f, --file <path>', 'The forge project file', normalizePath, './forge.js')
   .option('--cwd <path>', 'The current working directory for the forge file', normalizePath, './forge.js')
   .option('-r, --record-file <record file path>', 'If set, will export the resulting build record as a JSON file', normalizePath, null)
   .action(async (args) => {
      try {
         let record = await build(args.file, {
            cwd: args.cwd || process.cwd
         })

         if(args.recordFile) {
            await writeBuildState(record, args.recordFile)
         }
   
         process.exit(0)
      } catch(err) {
         console.error(`Failed to perform the forge build. Reason:\n`)
         printError(err)
         process.exit(1)
      }
   })
   
program.parse(process.argv)


/*------------------------------------------------------------------------
 * Writes out the BuildRecord to disk
 * @param record The BuildRecord
 * @param outPath The absolute path to the BuildRecord file
 *----------------------------------------------------------------------*/
async function writeBuildState(record: BuildRecord, outPath: string) {
   let outDir = path.dirname(outPath)
   await fs.ensureDir(outDir)
   await fs.writeJson(outPath, record, { spaces: 2 })
}

/*------------------------------------------------------------------------
 * Resolves a path to an absolute path.

 * @param filePath A relative or absolute file path
 *----------------------------------------------------------------------*/
function normalizePath(filePath) {
   if (filePath.charAt(0) === '.') {
      return path.resolve(filePath)
   }

   return resolve(filePath)
}

/*------------------------------------------------------------------------
 * Formats an Error into a readable string with stack trace and message
 * 
 * @param {Error} err The Error to format
 *----------------------------------------------------------------------*/
function formatError(err) {
   let result = `${err}`

   if (err.stack) {
      result += '\n\n--------------------------------------------------------\n'

      if (err.message) {
         result += `:: Message:\n${err.message}\n`
      }

      result += `\n:: Stack\n${err.stack}`
      result += '\n--------------------------------------------------------\n'
   }

   return result
}

/*------------------------------------------------------------------------
 * Prints an Error object
 * 
 * @param {Error} err 
 *----------------------------------------------------------------------*/
function printError(err) {
   console.log(formatError(err))
}