const fs = require('fs-extra')

export type GenericObject = {
   [key: string]: any
}

export type BuildConfigFn = (builder: ConfigBuilder) => Promise<GenericObject>

export class ConfigBuilder {
   constructor() {

   }

   /**
    * Retrieves an environment variable, or returns a default value if it doesn't exist
    * 
    * @param envVar The environment variable to use
    * @param def The default value if the environment variable doesn't exist
    */
   env(envVar: string, def: string): string {
      return process.env[envVar] == null ? def : process.env[envVar] as string
   }

   /**
    * Reads in a jsonFile
    * 
    * @param filePath The path to the JSON file
    */
   async jsonFile(filePath: string): Promise<GenericObject> {
      return fs.readJson(filePath)
   }

   /**
    * Reads in a JSON file whose path is provided in an environment variable,
    * or a default location if the environment variable doesn't exist.
    *
    * @param envVar The environment variable
    * @param def The efault value if the environment variable doesn't exist
    */
   async jsonFileEnv(envVar: string, def: string): Promise<GenericObject> {
      return process.env[envVar] == null ? fs.readJson(def) : fs.readJson(process.env[envVar])
   }
}