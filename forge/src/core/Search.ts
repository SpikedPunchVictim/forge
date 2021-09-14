import { NamedPlugin } from "./NamedPlugin";
import { IForgePipeline } from "./ForgeTransform";

export class Search {
   private globalPlugins: Array<NamedPlugin>

   constructor(globalPlugins: Array<NamedPlugin>) {
      this.globalPlugins = globalPlugins
   }

   /**
    * Find a plugin from the perspective of a Transform
    * 
    * @param name The name of the plugin
    * @param transform The tansform
    */
   findPlugin(name: string, transform: IForgePipeline) {
      let found = transform.findPlugin(name)

      if(found) {
         return found
      }

      return this.globalPlugins.find(plugin => plugin.name.toLowerCase() === name.toLowerCase())
   }
}