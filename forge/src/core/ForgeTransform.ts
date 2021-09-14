import { IBuildState } from './BuildState'
import { NamedPlugin } from './NamedPlugin'
import { isDefined } from '../utils/Utils'
import { IPlugin } from '../plugins/IPlugin'
import { IStep } from './Step'
import { FileSearchScope } from './FileSearchScope'
import { GenericObject } from './ConfigBuilder'

export interface IForgeScript {
   init: (state: IBuildState) => Promise<GenericObject>
   beforeRun: (state: IBuildState) => Promise<boolean>
   afterRun: (state: IBuildState) => Promise<boolean>
}

/**
 * An empty implementation of IForgeScript
 */
export class EmptyForgeScript implements IForgeScript {
   async init(state: IBuildState): Promise<GenericObject> {
      return Promise.resolve({})
   }

   async beforeRun(state: IBuildState): Promise<boolean> {
      return Promise.resolve(true)
   }

   async afterRun(state: IBuildState): Promise<boolean> {
      return Promise.resolve(true)
   }
}

const EmptyPipelineScriptInstance = new EmptyForgeScript()

export interface IForgePipeline {
   name: string
   plugins: Array<NamedPlugin>
   script: IForgeScript
   steps: IStep[]
   readonly search: FileSearchScope

   /**
    * Searches this tranform for a plugin. If none is found, undefined is returned.
    * 
    * @param name The name of the plugin
    */
   findPlugin(name: string): IPlugin | undefined
}

export class ForgePipeline implements IForgePipeline {
   public name: string
   public plugins: Array<NamedPlugin>
   public script: IForgeScript
   public steps: Array<IStep>
   readonly search: FileSearchScope

   constructor(
      name: string,
      plugins: Array<NamedPlugin>,
      script: IForgeScript,
      steps: Array<IStep>,
      search: FileSearchScope
   ) {
      this.name = name
      this.plugins = isDefined(plugins) ? plugins : new Array<NamedPlugin>()
      this.script = isDefined(script) ? script : EmptyPipelineScriptInstance
      this.steps = steps
      this.search = search
   }

   /**
    * Searches this tranform for a plugin. If none is found, undefined is returned.
    * 
    * @param name The name of the plugin
    */
   findPlugin(name: string): IPlugin | undefined {
      let result = this.plugins.find(plugin => plugin.name.toLowerCase() === name.toLowerCase())
      return isDefined(result) ? result.plugin : undefined
   }
}
