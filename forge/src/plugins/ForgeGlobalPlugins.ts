import { NamedPlugin } from "../core/NamedPlugin";
import { IPlugin } from "./IPlugin";

class ForgeGlobalPlugins {
   // Key: Plugin name
   // Value: The plugin
   private registeredPlugins: Map<string, IPlugin> = new Map<string, IPlugin>()

   get plugins(): NamedPlugin[] {
      let results = new Array<NamedPlugin>()

      for(let [key, value] of this.registeredPlugins) {
         results.push({
            name: key, plugin: value
         })
      }

      return results
   }

   get(name: string): IPlugin | undefined {
      return this.registeredPlugins.get(name)
   }

   register(name: string, plugin: IPlugin): void {
      this.registeredPlugins.set(name, plugin)
   }
}

export let GlobalPlugins = new ForgeGlobalPlugins()