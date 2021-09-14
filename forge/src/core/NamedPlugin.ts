import { IPlugin } from '../plugins/IPlugin'

export class NamedPlugin {
   readonly name: string
   readonly plugin: IPlugin

   constructor(name: string, plugin: IPlugin) {
      if(name === undefined) {
         throw new Error('Plugin name is must be valid')
      }

      if(plugin === undefined) {
         throw new Error('plugin must be defined')
      }

      this.name = name
      this.plugin = plugin
   }
}