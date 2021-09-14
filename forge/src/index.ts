import { IPlugin } from './plugins/IPlugin'
import { IEnvoy } from './plugins/IEnvoy'
import { ForgeConfig, ForgeOptions } from './core/ForgeOptions'
import { ForgeBuilder } from './core/ForgeBuilder'
import { BuildRecord, ExportRecord } from './core/BuildRecord'
import { IBuildState } from './core/BuildState'
import { IStep, StepInfo } from './core/Step'
import { GlobalPlugins } from './plugins/ForgeGlobalPlugins'
import { ForgeBuffer } from './plugins/ForgeBuffer'
import { ForgeStream } from './plugins/ForgeStream'
import { ForgeFn } from './plugins/ForgeFn'
import { ForgeHttpPlugin } from './plugins/ForgeHttpPlugin'

export * from './streams'
export * from './traits'
export * from './utils'

export {
   BuildRecord,
   ExportRecord,
   ForgeOptions,
   IBuildState,
   IEnvoy,
   IPlugin,
   IStep,
   StepInfo
}

//-- Global Plugins
GlobalPlugins.register(':buffer', new ForgeBuffer())
GlobalPlugins.register(':stream', new ForgeStream())
GlobalPlugins.register(':fn', new ForgeFn())
GlobalPlugins.register(':http', new ForgeHttpPlugin())

export async function build(config: ForgeConfig | string, options: ForgeOptions = new ForgeOptions()): Promise<BuildRecord> {
   let importedConfig: ForgeConfig | string | undefined = undefined
   if (typeof config === 'string') {
      importedConfig = await import(config)
   } else if (typeof config === 'object') {
      importedConfig = config
   } else {
      throw new Error(`Unsupported config type used ${typeof config}. Expected a string or an object`)
   }

   if(importedConfig == null) {
      throw new Error(`Could not resolve 'config'. Ensure the path or Object is valid.`)
   }

   let normalizedOptions = await ForgeConfig.normalize(importedConfig, options)
   let builder = new ForgeBuilder(normalizedOptions, options)
   builder.on('rate', onRate)
   return builder.build()
}

function onRate(obj) {

}