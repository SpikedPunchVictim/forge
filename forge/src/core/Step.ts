import { IPlugin } from "../plugins/IPlugin";
import { isDefined } from "../utils/Utils";

export type StepInfo = {
   alias: string
   plugin: string
   [key: string]: any
}

export interface IStep {
   alias: string
   plugin: IPlugin
   readonly use: Array<string>
   info: StepInfo
}

export class Step implements IStep {
   readonly plugin: IPlugin

   get alias(): string {
      return this.info.alias
   }

   readonly use: Array<string>

   readonly info: StepInfo

   constructor(info: StepInfo, plugin: IPlugin, use: string | string[]) {
      this.info = info
      this.plugin = plugin

      if(!Array.isArray(use)){
         use = [use]
      }
      
      this.use = use
   }

   /**
    * Ensures that the StepInfo contains the expected structure. Throws
    * an Error if it doesn't.
    * 
    * @param info The info object
    */
   static validate(info: StepInfo): void {
      if(!isDefined(info.alias)) {
         throw new Error(`Expected Step to include an alias. None was provided.`)
      }

      if(!isDefined(info.plugin)) {
         throw new Error(`Expected Step to include an plugin. None was provided.`)
      }
   }
}