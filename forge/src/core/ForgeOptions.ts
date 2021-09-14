const path = require('path')
import { IPlugin } from '../plugins/IPlugin'
import { ForgePipeline, IForgePipeline, IForgeScript } from './ForgeTransform'
import { ConsoleLogger, ILogger } from '../utils/Logger'
import { isDefined, safelyRun } from '../utils/Utils'
import { EmptyForgeScript } from './ForgeTransform'
import { NamedPlugin } from './NamedPlugin'
import { IStep, Step, StepInfo } from './Step'
import { ConfigBuilder, GenericObject } from './ConfigBuilder'
import { FileSearchScope } from './FileSearchScope'
import { GlobalPlugins } from '../plugins/ForgeGlobalPlugins'

export type BuiltConfig = {
   [key: string]: any
}

export type StepBuildParams = {
   config: BuiltConfig
}

export type BuildStepFn = (params: StepBuildParams) => Promise<StepInfo>

type ResolveEntry = string | string[]

type PluginEntry = {
   name: string
   plugin: IPlugin
}

type ScriptEntry = string | IForgeScript

type StepEntry = StepInfo | BuildStepFn

type PipelineEntry = {
   plugins: PluginEntry | PluginEntry[]
   resolve: ResolveEntry
   script: ScriptEntry
   steps: StepEntry[]
}

export type ResolvePathsFn = () => Promise<string[]>

export class ForgeOptions {
   cwd?: string
   logger?: ILogger

   constructor(logger = new ConsoleLogger(), cwd = process.cwd()) {
      this.logger = logger
      this.cwd = cwd
   }
}

/*-----------------------------------------------------------------------*
 * This class represents a series of pipelines to
 * be run by the ForgBuilder.
 *----------------------------------------------------------------------*/
export class ForgeConfig {
   resolve: FileSearchScope
   script: IForgeScript
   plugins: Array<NamedPlugin>
   pipelines: Array<IForgePipeline>

   constructor() {
      this.resolve = new FileSearchScope()
      this.script = new EmptyForgeScript()
      this.plugins = new Array<NamedPlugin>()
      this.pipelines = new Array<IForgePipeline>()
   }

   static async normalize(config: any, options: ForgeOptions): Promise<ForgeConfig> {
      return await normalize(config, options)
   }
}

/*-----------------------------------------------------------------------*
 * This function will normalize the set of options
 * provided by the developer.
 * 
 * Example format:
 *    {
 *       plugins: [
 *          { name: 'swig', new SwigPlugin() },
 *          { name: 'xml', new XmlPlugin() }
 *       ],
 *       pipelines: {
 *          somename: {
 *             steps: [
 *                {
 *                   alias: 'xml',
 *                   plugin: 'xml',
 *                   source: 'https://some-url/file.xml'
 *                },
 *                {
 *                   alias: 'script',
 *                   plugin: 'script',
 *                   use: 'xml',
 *                   script: 'some/relative/path.js',
 *                },
 *                {
 *                   alias: 'write',
 *                   plugin: 'swig',
 *                   template: 'relative/path/to/file.template'
 *                }
 *             ]
 *          }
 *       }
 *    }
 * 
 * 
 * @param config The external config object.
 *----------------------------------------------------------------------*/
export async function normalize(config: any, options: ForgeOptions): Promise<ForgeConfig> {
   let forgeConfig = new ForgeConfig()

   if (config == null) {
      return forgeConfig
   }

   let error = (msg: string) => {
      return new Error(`Config Parser: ${msg}`)
   }

   if (!isDefined(options.cwd)) {
      options.cwd = process.cwd()
   }

   //-- Sanitize
   if (config.plugins) {
      if (!Array.isArray(config.plugins)) {
         throw error('plugins exists, but is not an Array')
      }
   }

   if (config.pipelines) {
      if (typeof config.pipelines !== 'object') {
         throw error('pipelines exists, but must be an object')
      }
   }

   if(config.steps && config.pipelines == null) {
      config.pipelines = {
         default: {
            steps: config.steps
         }
      }

      delete config.steps
   }

   //-- Normalize
   let globalSearchScope = await importResolve(config.resolve, options)
   forgeConfig.resolve = globalSearchScope
   forgeConfig.resolve.add(options.cwd)

   forgeConfig.script = await importScript(config.script, globalSearchScope)

   let configBuilder = new ConfigBuilder()
   let globalConfig = await safelyRun<GenericObject>(forgeConfig.script.init, configBuilder)
   globalConfig = globalConfig || {}

   let globalPluginMap = new Map<string, IPlugin>()

   // Add the Forge Internal Plugins
   GlobalPlugins.plugins.forEach(pl => globalPluginMap.set(pl.name, pl.plugin))

   forgeConfig.plugins = await importPlugins(config.plugins, globalConfig)

   forgeConfig.plugins.forEach(pl => globalPluginMap.set(pl.name, pl.plugin))

   for (let name of Object.keys(config.pipelines)) {
      let transform: ForgePipeline | undefined = undefined

      transform = await importPipeline(
         name,
         config.pipelines[name],
         globalConfig,
         globalSearchScope,
         globalPluginMap,
         options
      )

      forgeConfig.pipelines.push(transform)
   }

   return forgeConfig
}

/*-----------------------------------------------------------------------*
 * Imports a non-sanitized pipeline from config
 * 
 * Example format:
 *    {
 *       resolve: '',
 *       script: 'path/ro.script.js',
 *       plugins: [
 *          { name: 'plugin-name', plugin: IPlugin }
 *       ],
 *       steps: [
 *          {
 *             alias: 'xml',
 *             plugin: 'xml',
 *             source: 'https://some-url/file.xml'
 *          },
 *          {
 *             alias: 'script',
 *             plugin: 'script',
 *             use: 'xml',
 *             script: 'some/relative/path.js',
 *          },
 *          {
 *             alias: 'write',
 *             plugin: 'swig',
 *             template: 'relative/path/to/file.template'
 *          }
 *       ]
 *    }
 * 
 *    script { string | object }: string | IForgeScript
 * 
 * @param transform The transform to normalize
 * @param globalPluginMap Map of plugins defined at the global level
 *----------------------------------------------------------------------*/
async function importPipeline(
   name: string,
   transform: PipelineEntry,
   globalConfig: GenericObject,
   globalSearchScope: FileSearchScope,
   globalPluginMap: Map<string, IPlugin>,
   options: ForgeOptions
): Promise<ForgePipeline> {
   try {
      let searchScope = await importResolve(transform.resolve, options)
      searchScope.merge(globalSearchScope)

      let script = await importScript(transform.script, searchScope)

      let buildConfig = new ConfigBuilder()
      let transformConfig = await safelyRun<GenericObject>(script.init, { buildConfig })
      transformConfig = transformConfig || {}

      // Pass any missing config paramters from the global config to the
      // transform config
      for (let [key, value] of Object.entries(globalConfig)) {
         if (transformConfig[key] == null) {
            transformConfig[key] = value
         }
      }

      let plugins = await importPlugins(transform.plugins, globalConfig, transformConfig)

      // Create a plugin map of global and local plugins
      let pluginMap = new Map<string, IPlugin>()

      for (let [key, value] of globalPluginMap) {
         pluginMap.set(key, value)
      }

      // Add local plugins after to "override" global plugins
      for (let named of plugins) {
         pluginMap.set(named.name, named.plugin)
      }

      plugins = new Array<NamedPlugin>()
      for (let [key, value] of pluginMap.entries()) {
         plugins.push(new NamedPlugin(key, value))
      }

      let steps = await importPipelineSteps(name, transform.steps, transformConfig, pluginMap)

      return new ForgePipeline(name, plugins, script, steps, searchScope)
   } catch (err) {
      throw err
   }
}

/*-----------------------------------------------------------------------*
 * Normalizesand imports the plugin section of a transform
 * 
 * @param transformName {string} The name of the transform
 * @param plugins { Array | object } The plugins configuration
 *----------------------------------------------------------------------*/
async function importPlugins(
   plugins: PluginEntry | PluginEntry[],
   globalConfig: GenericObject,
   localConfig: GenericObject = {}
): Promise<Array<NamedPlugin>> {
   let results = new Array<NamedPlugin>()

   if (!isDefined(plugins)) {
      return results
   }

   let importPlugins = async (entry: PluginEntry): Promise<NamedPlugin[]> => {
      if (typeof entry === 'object') {
         let { name, plugin } = entry

         if (!isDefined(name)) {
            throw new Error(`Plugin name is missing. Ensure all plugins have a 'name' defined`)
         }

         if (!isDefined(plugin)) {
            throw new Error(`A Plugin entry is missing the oh so very important 'plugin' property. Ensure all plugins have their 'plugin' field populated.`)
         }

         return [new NamedPlugin(name, plugin)]
      } else if (typeof entry === 'function') {
         let castEntry = entry as (global: GenericObject, local: GenericObject) => Promise<NamedPlugin | NamedPlugin[]>
         let entries = await castEntry(globalConfig, localConfig)

         if (!Array.isArray(entries)) {
            entries = [entries]
         }

         return entries.map(it => new NamedPlugin(it.name, it.plugin))
      } else {
         throw new Error(`Encoutnered a plugin entry that is not in the expected format. Plugin entries are either functions or objects.`)
      }
   }

   if (Array.isArray(plugins)) {
      plugins = plugins as Array<PluginEntry>

      for (let entry of plugins) {
         results.push(...(await importPlugins(entry)))
      }
   } else if (typeof plugins === 'object') {
      results.push(...(await importPlugins(plugins)))
   } else {
      throw new Error(`Unsupported format encountered when importing plugins. Ensure each plugin entry has a 'name' and 'plugin' field.`)
   }

   return results
}

/*-----------------------------------------------------------------------*
 * Imports the Transform Script. Will read it in from disk if provided as a path, otherwise,
 * it will read it in from memory.
 * 
 * @param script {string | object} The script to import
 * @param context The ForgeOptionsContext
 *----------------------------------------------------------------------*/
async function importScript(script: string | IForgeScript, scope: FileSearchScope): Promise<IForgeScript> {
   if (typeof script === 'string') {
      if (path.isAbsolute(script)) {
         return await import(script)
      }

      let found = await scope.find(script)

      if (found === undefined) {
         throw new Error(`Could not find script ${script}. Ensure the correct resolves exist or that the script is being called from the desired location.`)
      }

      return await import(found)
   } else if (typeof script === 'object') {
      return script as IForgeScript
   } else {
      return new EmptyForgeScript()
   }
}

/*-----------------------------------------------------------------------*
 * Imports the Pipeline Steps

 * @param transformName TRansform name
 * @param steps List of plain object Steps
 * @param transformConfig The transform config that was generated by 
 *    running the init() transform script
 * @param pluginMap Map of plugins by name (global + local)
 *----------------------------------------------------------------------*/
async function importPipelineSteps(transformName: string, steps: StepEntry[], transformConfig: GenericObject, pluginMap: Map<string, IPlugin>): Promise<IStep[]> {
   let results = new Array<IStep>()

   for (let step of steps) {
      let importedStep: StepInfo | undefined = undefined

      if (typeof step === 'function') {
         importedStep = await safelyRun<StepInfo>(step, { config: transformConfig })
      } else if (typeof step === 'object') {
         importedStep = step
      } else {
         throw new Error(`A Transform step must be a function or an object. Encoutnered a ${typeof step} instead in transform ${transformName}`)
      }

      if (importedStep == null) {
         throw new Error(`Failed to import a step in the transform ${transformName}`)
      }

      Step.validate(importedStep)

      let plugin = pluginMap.get(importedStep.plugin)

      if (plugin === undefined) {
         throw new Error(`Could not find plugin ${importedStep.plugin} in Step ${importedStep.alias}`)
      }

      results.push(new Step(importedStep, plugin, importedStep.use || new Array<String>()))
   }

   return results
}

async function importResolve(
   resolve: string | string[] | ResolvePathsFn | undefined,
   options: ForgeOptions): Promise<FileSearchScope> {
   let resolves = new Array<string>()

   if (resolve === undefined) {
      return new FileSearchScope(resolves)
   }

   let absolute = (p: string): string => {
      return path.isAbsolute(p) ? p : path.join(options.cwd, p)
   }

   if (typeof resolve === 'string') {
      resolves = [(absolute(resolve))]
   } else if (typeof resolve == 'function') {
      let paths = await resolve()
      for await (let p of paths) {
         resolves.push(absolute(p))
      }
   } else if (Array.isArray(resolve)) {
      resolves = resolve.map(p => absolute(p))
   } else {
      throw new Error(`Unsupported resolve format encountered. 'resolve' must be a string, string[], or a function that returmns a string[]`)
   }

   return new FileSearchScope(resolves)
}

/*-----------------------------------------------------------------------*
 * Imports the imports section of a Transform
 *
 * @param transformName The name of the importing transform
 * @param imports The imports object
 *----------------------------------------------------------------------*/
// function importTransformImports(transformName: string, imports: any, globalPluginMap: Map<string, IPlugin>): Array<IImportParams> {
//    let results = new Array<IImportParams>()

//    /*
//       Required parameters:
//          - alias {string} The alias of this import parameters
//          - plugin {string | IPlugin}: The plugin used for importing 
//    */
//    let importEntry = im => {
//       let result = {...im}

//       if(!isDefined(im.alias)) {
//          throw new Error(`No 'alias' defined for import in transform ${transformName}`)
//       }

//       if(!isDefined(im.plugin)) {
//          throw new Error(`No 'plugin' defined for import in transform ${transformName}`)
//       }

//       if(typeof im.plugin === 'string') {
//          // Lookup the referenced plugin
//          let found = globalPluginMap.get(im.plugin)

//          if(!isDefined(found)) {
//             throw new Error(`Unable to find 'plugin' ${im.plugin} referenced in the import section in transform ${transformName}`)
//          }

//          result.plugin = found
//       } else if (isPlugin(im.plugin)) {
//          result.plugin = im.plugin
//       } else {
//          throw new Error(`Unsupported format for the 'plugin' referenced in the import in transform ${transformName}`)
//       }

//       return result as IImportParams
//    }

//    if(isDefined(imports)) {
//       if(Array.isArray(imports)) {
//          results = imports.map(it => importEntry(it))
//       } else if(typeof imports === 'object') {
//          results.push(importEntry(imports))
//       } else {
//          throw new Error(`Unsupported format encountered when importing the imports section for transform ${name}`)
//       }
//    }

//    return results
// }



/*-----------------------------------------------------------------------*
 * Imports the export portion of a transform
 *
 * @param transformName The transform name
 * @param exports List of export parameters
 * @param globalPluginMap Global map of alias-to-plugin entries
 *----------------------------------------------------------------------*/
// function importTransformExports(
//    transformName: string,
//    exports: any,
//    globalPluginMap: Map<string, IPlugin>): Array<IExportParams> {

//    let results = new Array<IExportParams>()

//    if(!isDefined(exports)) {
//       return new Array<IExportParams>()   
//    }

//    /*
//       Required parameters:
//          - alias {string} The alias of this expor parameters
//          - plugin {string | IPlugin}: The plugin used for exporting

//       Optional:
//          - use {string | Array<atring>}: References to the imported Envoy aliases
//    */
//    let importEntry = ex => {
//       let result = { ...ex }

//       if(!isDefined(ex.alias)) {
//          throw new Error(`No 'alias' defined for the export in transform ${transformName}`)
//       }

//       if(!isDefined(ex.plugin)) {
//          throw new Error(`No 'plugin' defined for the export in transform ${transformName}`)
//       }

//       if(typeof ex.plugin === 'string') {
//          // Lookup the referenced plugin
//          let found = globalPluginMap.get(ex.plugin)

//          if(!isDefined(found)) {
//             throw new Error(`Unable to find 'plugin' ${ex.plugin} referenced in the export section in transform ${transformName}`)
//          }

//          result.plugin = found
//       } else if (isPlugin(ex.plugin)) {
//          result.plugin = ex.plugin
//       } else {
//          throw new Error(`Unsupported format for the 'plugin' referenced in the import in transform ${transformName}`)
//       }

//       let use = new Array<{ alias: string, envoy: IEnvoy }>()

//       if(ex.use) {
//          if(!Array.isArray(ex.use) && typeof ex.use !== 'string') {
//             throw new Error(`Unsupported 'use' option type referenced in the export section of transform ${transformName}. It must be a string or an Array<string>.`)
//          }

//          if(typeof ex.use === 'string') {
//             use.push({ alias: ex.use, envoy: null })
//          } else if(Array.isArray(ex.use)) {
//             for(let alias of ex.use) {
//                use.push({ alias, envoy: null })
//             }
//          } else {
//             throw new Error(`Unknown format encountered for the export 'use' option in transform ${transformName}. It must be a string or an Array<string>.`)
//          }
//       }

//       result.use = use

//       return result as IExportParams
//    }

//    if(Array.isArray(exports)) {
//       for(let exp of exports) {
//          results.push(importEntry(exp))
//       }
//    } else if(typeof exports === 'object') {
//       results.push(importEntry(exports))
//    } else {
//       throw new Error(`Unexpected format for the exports value in transform ${transformName}. It needs to: not exist, be an object or an Array`)
//    }

//    return results
// }

// /*-----------------------------------------------------------------------*
//  * Searches for a plugin from the scope of a Transform
//  * 
//  * @param name The name of the plugin to find
//  * @param transform The transform
//  *----------------------------------------------------------------------*/
// function findPlugin(name: string, transform: ForgeTransform): IPlugin {
//    let found = transform.findPlugin(name)

//    if(found) {
//       return found
//    }

//    let globalFound = this.plugins.find(plugin => plugin.name.toLowerCase() === name.toLowerCase())
//    return globalFound ? globalFound.plugin : undefined
// }
