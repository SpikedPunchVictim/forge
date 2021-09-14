"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = exports.ForgeConfig = exports.ForgeOptions = void 0;
const path = require('path');
const ForgeTransform_1 = require("./ForgeTransform");
const Logger_1 = require("../utils/Logger");
const Utils_1 = require("../utils/Utils");
const ForgeTransform_2 = require("./ForgeTransform");
const NamedPlugin_1 = require("./NamedPlugin");
const Step_1 = require("./Step");
const ConfigBuilder_1 = require("./ConfigBuilder");
const FileSearchScope_1 = require("./FileSearchScope");
const ForgeGlobalPlugins_1 = require("../plugins/ForgeGlobalPlugins");
class ForgeOptions {
    constructor(logger = new Logger_1.ConsoleLogger(), cwd = process.cwd()) {
        this.logger = logger;
        this.cwd = cwd;
    }
}
exports.ForgeOptions = ForgeOptions;
/*-----------------------------------------------------------------------*
 * This class represents a series of pipelines to
 * be run by the ForgBuilder.
 *----------------------------------------------------------------------*/
class ForgeConfig {
    constructor() {
        this.resolve = new FileSearchScope_1.FileSearchScope();
        this.script = new ForgeTransform_2.EmptyForgeScript();
        this.plugins = new Array();
        this.pipelines = new Array();
    }
    static async normalize(config, options) {
        return await normalize(config, options);
    }
}
exports.ForgeConfig = ForgeConfig;
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
async function normalize(config, options) {
    let forgeConfig = new ForgeConfig();
    if (config == null) {
        return forgeConfig;
    }
    let error = (msg) => {
        return new Error(`Config Parser: ${msg}`);
    };
    if (!Utils_1.isDefined(options.cwd)) {
        options.cwd = process.cwd();
    }
    //-- Sanitize
    if (config.plugins) {
        if (!Array.isArray(config.plugins)) {
            throw error('plugins exists, but is not an Array');
        }
    }
    if (config.pipelines) {
        if (typeof config.pipelines !== 'object') {
            throw error('pipelines exists, but must be an object');
        }
    }
    if (config.steps && config.pipelines == null) {
        config.pipelines = {
            default: {
                steps: config.steps
            }
        };
        delete config.steps;
    }
    //-- Normalize
    let globalSearchScope = await importResolve(config.resolve, options);
    forgeConfig.resolve = globalSearchScope;
    forgeConfig.resolve.add(options.cwd);
    forgeConfig.script = await importScript(config.script, globalSearchScope);
    let configBuilder = new ConfigBuilder_1.ConfigBuilder();
    let globalConfig = await Utils_1.safelyRun(forgeConfig.script.init, configBuilder);
    globalConfig = globalConfig || {};
    let globalPluginMap = new Map();
    // Add the Forge Internal Plugins
    ForgeGlobalPlugins_1.GlobalPlugins.plugins.forEach(pl => globalPluginMap.set(pl.name, pl.plugin));
    forgeConfig.plugins = await importPlugins(config.plugins, globalConfig);
    forgeConfig.plugins.forEach(pl => globalPluginMap.set(pl.name, pl.plugin));
    for (let name of Object.keys(config.pipelines)) {
        let transform = undefined;
        transform = await importPipeline(name, config.pipelines[name], globalConfig, globalSearchScope, globalPluginMap, options);
        forgeConfig.pipelines.push(transform);
    }
    return forgeConfig;
}
exports.normalize = normalize;
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
async function importPipeline(name, transform, globalConfig, globalSearchScope, globalPluginMap, options) {
    try {
        let searchScope = await importResolve(transform.resolve, options);
        searchScope.merge(globalSearchScope);
        let script = await importScript(transform.script, searchScope);
        let buildConfig = new ConfigBuilder_1.ConfigBuilder();
        let transformConfig = await Utils_1.safelyRun(script.init, { buildConfig });
        transformConfig = transformConfig || {};
        // Pass any missing config paramters from the global config to the
        // transform config
        for (let [key, value] of Object.entries(globalConfig)) {
            if (transformConfig[key] == null) {
                transformConfig[key] = value;
            }
        }
        let plugins = await importPlugins(transform.plugins, globalConfig, transformConfig);
        // Create a plugin map of global and local plugins
        let pluginMap = new Map();
        for (let [key, value] of globalPluginMap) {
            pluginMap.set(key, value);
        }
        // Add local plugins after to "override" global plugins
        for (let named of plugins) {
            pluginMap.set(named.name, named.plugin);
        }
        plugins = new Array();
        for (let [key, value] of pluginMap.entries()) {
            plugins.push(new NamedPlugin_1.NamedPlugin(key, value));
        }
        let steps = await importPipelineSteps(name, transform.steps, transformConfig, pluginMap);
        return new ForgeTransform_1.ForgePipeline(name, plugins, script, steps, searchScope);
    }
    catch (err) {
        throw err;
    }
}
/*-----------------------------------------------------------------------*
 * Normalizesand imports the plugin section of a transform
 *
 * @param transformName {string} The name of the transform
 * @param plugins { Array | object } The plugins configuration
 *----------------------------------------------------------------------*/
async function importPlugins(plugins, globalConfig, localConfig = {}) {
    let results = new Array();
    if (!Utils_1.isDefined(plugins)) {
        return results;
    }
    let importPlugins = async (entry) => {
        if (typeof entry === 'object') {
            let { name, plugin } = entry;
            if (!Utils_1.isDefined(name)) {
                throw new Error(`Plugin name is missing. Ensure all plugins have a 'name' defined`);
            }
            if (!Utils_1.isDefined(plugin)) {
                throw new Error(`A Plugin entry is missing the oh so very important 'plugin' property. Ensure all plugins have their 'plugin' field populated.`);
            }
            return [new NamedPlugin_1.NamedPlugin(name, plugin)];
        }
        else if (typeof entry === 'function') {
            let castEntry = entry;
            let entries = await castEntry(globalConfig, localConfig);
            if (!Array.isArray(entries)) {
                entries = [entries];
            }
            return entries.map(it => new NamedPlugin_1.NamedPlugin(it.name, it.plugin));
        }
        else {
            throw new Error(`Encoutnered a plugin entry that is not in the expected format. Plugin entries are either functions or objects.`);
        }
    };
    if (Array.isArray(plugins)) {
        plugins = plugins;
        for (let entry of plugins) {
            results.push(...(await importPlugins(entry)));
        }
    }
    else if (typeof plugins === 'object') {
        results.push(...(await importPlugins(plugins)));
    }
    else {
        throw new Error(`Unsupported format encountered when importing plugins. Ensure each plugin entry has a 'name' and 'plugin' field.`);
    }
    return results;
}
/*-----------------------------------------------------------------------*
 * Imports the Transform Script. Will read it in from disk if provided as a path, otherwise,
 * it will read it in from memory.
 *
 * @param script {string | object} The script to import
 * @param context The ForgeOptionsContext
 *----------------------------------------------------------------------*/
async function importScript(script, scope) {
    if (typeof script === 'string') {
        if (path.isAbsolute(script)) {
            return await Promise.resolve().then(() => require(script));
        }
        let found = await scope.find(script);
        if (found === undefined) {
            throw new Error(`Could not find script ${script}. Ensure the correct resolves exist or that the script is being called from the desired location.`);
        }
        return await Promise.resolve().then(() => require(found));
    }
    else if (typeof script === 'object') {
        return script;
    }
    else {
        return new ForgeTransform_2.EmptyForgeScript();
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
async function importPipelineSteps(transformName, steps, transformConfig, pluginMap) {
    let results = new Array();
    for (let step of steps) {
        let importedStep = undefined;
        if (typeof step === 'function') {
            importedStep = await Utils_1.safelyRun(step, { config: transformConfig });
        }
        else if (typeof step === 'object') {
            importedStep = step;
        }
        else {
            throw new Error(`A Transform step must be a function or an object. Encoutnered a ${typeof step} instead in transform ${transformName}`);
        }
        if (importedStep == null) {
            throw new Error(`Failed to import a step in the transform ${transformName}`);
        }
        Step_1.Step.validate(importedStep);
        let plugin = pluginMap.get(importedStep.plugin);
        if (plugin === undefined) {
            throw new Error(`Could not find plugin ${importedStep.plugin} in Step ${importedStep.alias}`);
        }
        results.push(new Step_1.Step(importedStep, plugin, importedStep.use || new Array()));
    }
    return results;
}
async function importResolve(resolve, options) {
    let resolves = new Array();
    if (resolve === undefined) {
        return new FileSearchScope_1.FileSearchScope(resolves);
    }
    let absolute = (p) => {
        return path.isAbsolute(p) ? p : path.join(options.cwd, p);
    };
    if (typeof resolve === 'string') {
        resolves = [(absolute(resolve))];
    }
    else if (typeof resolve == 'function') {
        let paths = await resolve();
        for await (let p of paths) {
            resolves.push(absolute(p));
        }
    }
    else if (Array.isArray(resolve)) {
        resolves = resolve.map(p => absolute(p));
    }
    else {
        throw new Error(`Unsupported resolve format encountered. 'resolve' must be a string, string[], or a function that returmns a string[]`);
    }
    return new FileSearchScope_1.FileSearchScope(resolves);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yZ2VPcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvRm9yZ2VPcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUU1QixxREFBOEU7QUFDOUUsNENBQXdEO0FBQ3hELDBDQUFxRDtBQUNyRCxxREFBbUQ7QUFDbkQsK0NBQTJDO0FBQzNDLGlDQUE4QztBQUM5QyxtREFBOEQ7QUFDOUQsdURBQW1EO0FBQ25ELHNFQUE2RDtBQWdDN0QsTUFBYSxZQUFZO0lBSXRCLFlBQVksTUFBTSxHQUFHLElBQUksc0JBQWEsRUFBRSxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFO1FBQzFELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO0lBQ2pCLENBQUM7Q0FDSDtBQVJELG9DQVFDO0FBRUQ7OzswRUFHMEU7QUFDMUUsTUFBYSxXQUFXO0lBTXJCO1FBQ0csSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQTtRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksaUNBQWdCLEVBQUUsQ0FBQTtRQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxFQUFlLENBQUE7UUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEtBQUssRUFBa0IsQ0FBQTtJQUMvQyxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBVyxFQUFFLE9BQXFCO1FBQ3RELE9BQU8sTUFBTSxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQzFDLENBQUM7Q0FDSDtBQWhCRCxrQ0FnQkM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBFQW9DMEU7QUFDbkUsS0FBSyxV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QUFDdEUsd0tBQXdLO0FBQ3hLLGFBQWE7QUFFYiw0Q0FBNEM7QUFDNUMsdURBQXVEO0FBQ3ZELDhDQUE4QztBQUM5Qyx5Q0FBeUM7QUFDekMsa0RBQWtEO0FBQ2xELGdCQUFnQjtBQUNoQixvQkFBb0I7QUFDcEIsZ0tBQWdLO0FBQ2hLLGFBQWE7QUFDYixVQUFVO0FBRVYseUJBQXlCO0FBRXpCLHVDQUF1QztBQUN2QyxPQUFPO0FBRVAsa0NBQWtDO0FBQ2xDLGtDQUFrQztBQUNsQywwQ0FBMEM7QUFDMUMsVUFBVTtBQUNWLDhDQUE4QztBQUM5QywyQ0FBMkM7QUFDM0MsY0FBYztBQUNkLG1KQUFtSjtBQUNuSixPQUFPO0FBRVAsb0JBQW9CO0FBQ3BCLElBQUk7QUFFSiw2RUFBNkU7QUFDN0UseURBQXlEO0FBQ3pELE1BQU07QUFDTixnREFBZ0Q7QUFDaEQsb0NBQW9DO0FBQ3BDLDZFQUE2RTtBQUM3RSwwRUFBMEU7QUFDMUUsNENBQTRDO0FBRTVDLGlCQUFpQjtBQUNqQixxQkFBcUI7QUFDckIsT0FBTztBQUVQLHFHQUFxRztBQUNyRyx5REFBeUQ7QUFDekQsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmltcG9ydCB7IElQbHVnaW4gfSBmcm9tICcuLi9wbHVnaW5zL0lQbHVnaW4nXG5pbXBvcnQgeyBGb3JnZVBpcGVsaW5lLCBJRm9yZ2VQaXBlbGluZSwgSUZvcmdlU2NyaXB0IH0gZnJvbSAnLi9Gb3JnZVRyYW5zZm9ybSdcbmltcG9ydCB7IENvbnNvbGVMb2dnZXIsIElMb2dnZXIgfSBmcm9tICcuLi91dGlscy9Mb2dnZXInXG5pbXBvcnQgeyBpc0RlZmluZWQsIHNhZmVseVJ1biB9IGZyb20gJy4uL3V0aWxzL1V0aWxzJ1xuaW1wb3J0IHsgRW1wdHlGb3JnZVNjcmlwdCB9IGZyb20gJy4vRm9yZ2VUcmFuc2Zvcm0nXG5pbXBvcnQgeyBOYW1lZFBsdWdpbiB9IGZyb20gJy4vTmFtZWRQbHVnaW4nXG5pbXBvcnQgeyBJU3RlcCwgU3RlcCwgU3RlcEluZm8gfSBmcm9tICcuL1N0ZXAnXG5pbXBvcnQgeyBDb25maWdCdWlsZGVyLCBHZW5lcmljT2JqZWN0IH0gZnJvbSAnLi9Db25maWdCdWlsZGVyJ1xuaW1wb3J0IHsgRmlsZVNlYXJjaFNjb3BlIH0gZnJvbSAnLi9GaWxlU2VhcmNoU2NvcGUnXG5pbXBvcnQgeyBHbG9iYWxQbHVnaW5zIH0gZnJvbSAnLi4vcGx1Z2lucy9Gb3JnZUdsb2JhbFBsdWdpbnMnXG5cbmV4cG9ydCB0eXBlIEJ1aWx0Q29uZmlnID0ge1xuICAgW2tleTogc3RyaW5nXTogYW55XG59XG5cbmV4cG9ydCB0eXBlIFN0ZXBCdWlsZFBhcmFtcyA9IHtcbiAgIGNvbmZpZzogQnVpbHRDb25maWdcbn1cblxuZXhwb3J0IHR5cGUgQnVpbGRTdGVwRm4gPSAocGFyYW1zOiBTdGVwQnVpbGRQYXJhbXMpID0+IFByb21pc2U8U3RlcEluZm8+XG5cbnR5cGUgUmVzb2x2ZUVudHJ5ID0gc3RyaW5nIHwgc3RyaW5nW11cblxudHlwZSBQbHVnaW5FbnRyeSA9IHtcbiAgIG5hbWU6IHN0cmluZ1xuICAgcGx1Z2luOiBJUGx1Z2luXG59XG5cbnR5cGUgU2NyaXB0RW50cnkgPSBzdHJpbmcgfCBJRm9yZ2VTY3JpcHRcblxudHlwZSBTdGVwRW50cnkgPSBTdGVwSW5mbyB8IEJ1aWxkU3RlcEZuXG5cbnR5cGUgUGlwZWxpbmVFbnRyeSA9IHtcbiAgIHBsdWdpbnM6IFBsdWdpbkVudHJ5IHwgUGx1Z2luRW50cnlbXVxuICAgcmVzb2x2ZTogUmVzb2x2ZUVudHJ5XG4gICBzY3JpcHQ6IFNjcmlwdEVudHJ5XG4gICBzdGVwczogU3RlcEVudHJ5W11cbn1cblxuZXhwb3J0IHR5cGUgUmVzb2x2ZVBhdGhzRm4gPSAoKSA9PiBQcm9taXNlPHN0cmluZ1tdPlxuXG5leHBvcnQgY2xhc3MgRm9yZ2VPcHRpb25zIHtcbiAgIGN3ZD86IHN0cmluZ1xuICAgbG9nZ2VyPzogSUxvZ2dlclxuXG4gICBjb25zdHJ1Y3Rvcihsb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcigpLCBjd2QgPSBwcm9jZXNzLmN3ZCgpKSB7XG4gICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlclxuICAgICAgdGhpcy5jd2QgPSBjd2RcbiAgIH1cbn1cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSpcbiAqIFRoaXMgY2xhc3MgcmVwcmVzZW50cyBhIHNlcmllcyBvZiBwaXBlbGluZXMgdG9cbiAqIGJlIHJ1biBieSB0aGUgRm9yZ0J1aWxkZXIuXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGNsYXNzIEZvcmdlQ29uZmlnIHtcbiAgIHJlc29sdmU6IEZpbGVTZWFyY2hTY29wZVxuICAgc2NyaXB0OiBJRm9yZ2VTY3JpcHRcbiAgIHBsdWdpbnM6IEFycmF5PE5hbWVkUGx1Z2luPlxuICAgcGlwZWxpbmVzOiBBcnJheTxJRm9yZ2VQaXBlbGluZT5cblxuICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLnJlc29sdmUgPSBuZXcgRmlsZVNlYXJjaFNjb3BlKClcbiAgICAgIHRoaXMuc2NyaXB0ID0gbmV3IEVtcHR5Rm9yZ2VTY3JpcHQoKVxuICAgICAgdGhpcy5wbHVnaW5zID0gbmV3IEFycmF5PE5hbWVkUGx1Z2luPigpXG4gICAgICB0aGlzLnBpcGVsaW5lcyA9IG5ldyBBcnJheTxJRm9yZ2VQaXBlbGluZT4oKVxuICAgfVxuXG4gICBzdGF0aWMgYXN5bmMgbm9ybWFsaXplKGNvbmZpZzogYW55LCBvcHRpb25zOiBGb3JnZU9wdGlvbnMpOiBQcm9taXNlPEZvcmdlQ29uZmlnPiB7XG4gICAgICByZXR1cm4gYXdhaXQgbm9ybWFsaXplKGNvbmZpZywgb3B0aW9ucylcbiAgIH1cbn1cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSpcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBub3JtYWxpemUgdGhlIHNldCBvZiBvcHRpb25zXG4gKiBwcm92aWRlZCBieSB0aGUgZGV2ZWxvcGVyLlxuICogXG4gKiBFeGFtcGxlIGZvcm1hdDpcbiAqICAgIHtcbiAqICAgICAgIHBsdWdpbnM6IFtcbiAqICAgICAgICAgIHsgbmFtZTogJ3N3aWcnLCBuZXcgU3dpZ1BsdWdpbigpIH0sXG4gKiAgICAgICAgICB7IG5hbWU6ICd4bWwnLCBuZXcgWG1sUGx1Z2luKCkgfVxuICogICAgICAgXSxcbiAqICAgICAgIHBpcGVsaW5lczoge1xuICogICAgICAgICAgc29tZW5hbWU6IHtcbiAqICAgICAgICAgICAgIHN0ZXBzOiBbXG4gKiAgICAgICAgICAgICAgICB7XG4gKiAgICAgICAgICAgICAgICAgICBhbGlhczogJ3htbCcsXG4gKiAgICAgICAgICAgICAgICAgICBwbHVnaW46ICd4bWwnLFxuICogICAgICAgICAgICAgICAgICAgc291cmNlOiAnaHR0cHM6Ly9zb21lLXVybC9maWxlLnhtbCdcbiAqICAgICAgICAgICAgICAgIH0sXG4gKiAgICAgICAgICAgICAgICB7XG4gKiAgICAgICAgICAgICAgICAgICBhbGlhczogJ3NjcmlwdCcsXG4gKiAgICAgICAgICAgICAgICAgICBwbHVnaW46ICdzY3JpcHQnLFxuICogICAgICAgICAgICAgICAgICAgdXNlOiAneG1sJyxcbiAqICAgICAgICAgICAgICAgICAgIHNjcmlwdDogJ3NvbWUvcmVsYXRpdmUvcGF0aC5qcycsXG4gKiAgICAgICAgICAgICAgICB9LFxuICogICAgICAgICAgICAgICAge1xuICogICAgICAgICAgICAgICAgICAgYWxpYXM6ICd3cml0ZScsXG4gKiAgICAgICAgICAgICAgICAgICBwbHVnaW46ICdzd2lnJyxcbiAqICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAncmVsYXRpdmUvcGF0aC90by9maWxlLnRlbXBsYXRlJ1xuICogICAgICAgICAgICAgICAgfVxuICogICAgICAgICAgICAgXVxuICogICAgICAgICAgfVxuICogICAgICAgfVxuICogICAgfVxuICogXG4gKiBcbiAqIEBwYXJhbSBjb25maWcgVGhlIGV4dGVybmFsIGNvbmZpZyBvYmplY3QuXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5vcm1hbGl6ZShjb25maWc6IGFueSwgb3B0aW9uczogRm9yZ2VPcHRpb25zKTogUHJvbWlzZTxGb3JnZUNvbmZpZz4ge1xuICAgbGV0IGZvcmdlQ29uZmlnID0gbmV3IEZvcmdlQ29uZmlnKClcblxuICAgaWYgKGNvbmZpZyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZm9yZ2VDb25maWdcbiAgIH1cblxuICAgbGV0IGVycm9yID0gKG1zZzogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKGBDb25maWcgUGFyc2VyOiAke21zZ31gKVxuICAgfVxuXG4gICBpZiAoIWlzRGVmaW5lZChvcHRpb25zLmN3ZCkpIHtcbiAgICAgIG9wdGlvbnMuY3dkID0gcHJvY2Vzcy5jd2QoKVxuICAgfVxuXG4gICAvLy0tIFNhbml0aXplXG4gICBpZiAoY29uZmlnLnBsdWdpbnMpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb25maWcucGx1Z2lucykpIHtcbiAgICAgICAgIHRocm93IGVycm9yKCdwbHVnaW5zIGV4aXN0cywgYnV0IGlzIG5vdCBhbiBBcnJheScpXG4gICAgICB9XG4gICB9XG5cbiAgIGlmIChjb25maWcucGlwZWxpbmVzKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbmZpZy5waXBlbGluZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICB0aHJvdyBlcnJvcigncGlwZWxpbmVzIGV4aXN0cywgYnV0IG11c3QgYmUgYW4gb2JqZWN0JylcbiAgICAgIH1cbiAgIH1cblxuICAgaWYoY29uZmlnLnN0ZXBzICYmIGNvbmZpZy5waXBlbGluZXMgPT0gbnVsbCkge1xuICAgICAgY29uZmlnLnBpcGVsaW5lcyA9IHtcbiAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIHN0ZXBzOiBjb25maWcuc3RlcHNcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZGVsZXRlIGNvbmZpZy5zdGVwc1xuICAgfVxuXG4gICAvLy0tIE5vcm1hbGl6ZVxuICAgbGV0IGdsb2JhbFNlYXJjaFNjb3BlID0gYXdhaXQgaW1wb3J0UmVzb2x2ZShjb25maWcucmVzb2x2ZSwgb3B0aW9ucylcbiAgIGZvcmdlQ29uZmlnLnJlc29sdmUgPSBnbG9iYWxTZWFyY2hTY29wZVxuICAgZm9yZ2VDb25maWcucmVzb2x2ZS5hZGQob3B0aW9ucy5jd2QpXG5cbiAgIGZvcmdlQ29uZmlnLnNjcmlwdCA9IGF3YWl0IGltcG9ydFNjcmlwdChjb25maWcuc2NyaXB0LCBnbG9iYWxTZWFyY2hTY29wZSlcblxuICAgbGV0IGNvbmZpZ0J1aWxkZXIgPSBuZXcgQ29uZmlnQnVpbGRlcigpXG4gICBsZXQgZ2xvYmFsQ29uZmlnID0gYXdhaXQgc2FmZWx5UnVuPEdlbmVyaWNPYmplY3Q+KGZvcmdlQ29uZmlnLnNjcmlwdC5pbml0LCBjb25maWdCdWlsZGVyKVxuICAgZ2xvYmFsQ29uZmlnID0gZ2xvYmFsQ29uZmlnIHx8IHt9XG5cbiAgIGxldCBnbG9iYWxQbHVnaW5NYXAgPSBuZXcgTWFwPHN0cmluZywgSVBsdWdpbj4oKVxuXG4gICAvLyBBZGQgdGhlIEZvcmdlIEludGVybmFsIFBsdWdpbnNcbiAgIEdsb2JhbFBsdWdpbnMucGx1Z2lucy5mb3JFYWNoKHBsID0+IGdsb2JhbFBsdWdpbk1hcC5zZXQocGwubmFtZSwgcGwucGx1Z2luKSlcblxuICAgZm9yZ2VDb25maWcucGx1Z2lucyA9IGF3YWl0IGltcG9ydFBsdWdpbnMoY29uZmlnLnBsdWdpbnMsIGdsb2JhbENvbmZpZylcblxuICAgZm9yZ2VDb25maWcucGx1Z2lucy5mb3JFYWNoKHBsID0+IGdsb2JhbFBsdWdpbk1hcC5zZXQocGwubmFtZSwgcGwucGx1Z2luKSlcblxuICAgZm9yIChsZXQgbmFtZSBvZiBPYmplY3Qua2V5cyhjb25maWcucGlwZWxpbmVzKSkge1xuICAgICAgbGV0IHRyYW5zZm9ybTogRm9yZ2VQaXBlbGluZSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gICAgICB0cmFuc2Zvcm0gPSBhd2FpdCBpbXBvcnRQaXBlbGluZShcbiAgICAgICAgIG5hbWUsXG4gICAgICAgICBjb25maWcucGlwZWxpbmVzW25hbWVdLFxuICAgICAgICAgZ2xvYmFsQ29uZmlnLFxuICAgICAgICAgZ2xvYmFsU2VhcmNoU2NvcGUsXG4gICAgICAgICBnbG9iYWxQbHVnaW5NYXAsXG4gICAgICAgICBvcHRpb25zXG4gICAgICApXG5cbiAgICAgIGZvcmdlQ29uZmlnLnBpcGVsaW5lcy5wdXNoKHRyYW5zZm9ybSlcbiAgIH1cblxuICAgcmV0dXJuIGZvcmdlQ29uZmlnXG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXG4gKiBJbXBvcnRzIGEgbm9uLXNhbml0aXplZCBwaXBlbGluZSBmcm9tIGNvbmZpZ1xuICogXG4gKiBFeGFtcGxlIGZvcm1hdDpcbiAqICAgIHtcbiAqICAgICAgIHJlc29sdmU6ICcnLFxuICogICAgICAgc2NyaXB0OiAncGF0aC9yby5zY3JpcHQuanMnLFxuICogICAgICAgcGx1Z2luczogW1xuICogICAgICAgICAgeyBuYW1lOiAncGx1Z2luLW5hbWUnLCBwbHVnaW46IElQbHVnaW4gfVxuICogICAgICAgXSxcbiAqICAgICAgIHN0ZXBzOiBbXG4gKiAgICAgICAgICB7XG4gKiAgICAgICAgICAgICBhbGlhczogJ3htbCcsXG4gKiAgICAgICAgICAgICBwbHVnaW46ICd4bWwnLFxuICogICAgICAgICAgICAgc291cmNlOiAnaHR0cHM6Ly9zb21lLXVybC9maWxlLnhtbCdcbiAqICAgICAgICAgIH0sXG4gKiAgICAgICAgICB7XG4gKiAgICAgICAgICAgICBhbGlhczogJ3NjcmlwdCcsXG4gKiAgICAgICAgICAgICBwbHVnaW46ICdzY3JpcHQnLFxuICogICAgICAgICAgICAgdXNlOiAneG1sJyxcbiAqICAgICAgICAgICAgIHNjcmlwdDogJ3NvbWUvcmVsYXRpdmUvcGF0aC5qcycsXG4gKiAgICAgICAgICB9LFxuICogICAgICAgICAge1xuICogICAgICAgICAgICAgYWxpYXM6ICd3cml0ZScsXG4gKiAgICAgICAgICAgICBwbHVnaW46ICdzd2lnJyxcbiAqICAgICAgICAgICAgIHRlbXBsYXRlOiAncmVsYXRpdmUvcGF0aC90by9maWxlLnRlbXBsYXRlJ1xuICogICAgICAgICAgfVxuICogICAgICAgXVxuICogICAgfVxuICogXG4gKiAgICBzY3JpcHQgeyBzdHJpbmcgfCBvYmplY3QgfTogc3RyaW5nIHwgSUZvcmdlU2NyaXB0XG4gKiBcbiAqIEBwYXJhbSB0cmFuc2Zvcm0gVGhlIHRyYW5zZm9ybSB0byBub3JtYWxpemVcbiAqIEBwYXJhbSBnbG9iYWxQbHVnaW5NYXAgTWFwIG9mIHBsdWdpbnMgZGVmaW5lZCBhdCB0aGUgZ2xvYmFsIGxldmVsXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuYXN5bmMgZnVuY3Rpb24gaW1wb3J0UGlwZWxpbmUoXG4gICBuYW1lOiBzdHJpbmcsXG4gICB0cmFuc2Zvcm06IFBpcGVsaW5lRW50cnksXG4gICBnbG9iYWxDb25maWc6IEdlbmVyaWNPYmplY3QsXG4gICBnbG9iYWxTZWFyY2hTY29wZTogRmlsZVNlYXJjaFNjb3BlLFxuICAgZ2xvYmFsUGx1Z2luTWFwOiBNYXA8c3RyaW5nLCBJUGx1Z2luPixcbiAgIG9wdGlvbnM6IEZvcmdlT3B0aW9uc1xuKTogUHJvbWlzZTxGb3JnZVBpcGVsaW5lPiB7XG4gICB0cnkge1xuICAgICAgbGV0IHNlYXJjaFNjb3BlID0gYXdhaXQgaW1wb3J0UmVzb2x2ZSh0cmFuc2Zvcm0ucmVzb2x2ZSwgb3B0aW9ucylcbiAgICAgIHNlYXJjaFNjb3BlLm1lcmdlKGdsb2JhbFNlYXJjaFNjb3BlKVxuXG4gICAgICBsZXQgc2NyaXB0ID0gYXdhaXQgaW1wb3J0U2NyaXB0KHRyYW5zZm9ybS5zY3JpcHQsIHNlYXJjaFNjb3BlKVxuXG4gICAgICBsZXQgYnVpbGRDb25maWcgPSBuZXcgQ29uZmlnQnVpbGRlcigpXG4gICAgICBsZXQgdHJhbnNmb3JtQ29uZmlnID0gYXdhaXQgc2FmZWx5UnVuPEdlbmVyaWNPYmplY3Q+KHNjcmlwdC5pbml0LCB7IGJ1aWxkQ29uZmlnIH0pXG4gICAgICB0cmFuc2Zvcm1Db25maWcgPSB0cmFuc2Zvcm1Db25maWcgfHwge31cblxuICAgICAgLy8gUGFzcyBhbnkgbWlzc2luZyBjb25maWcgcGFyYW10ZXJzIGZyb20gdGhlIGdsb2JhbCBjb25maWcgdG8gdGhlXG4gICAgICAvLyB0cmFuc2Zvcm0gY29uZmlnXG4gICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZ2xvYmFsQ29uZmlnKSkge1xuICAgICAgICAgaWYgKHRyYW5zZm9ybUNvbmZpZ1trZXldID09IG51bGwpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybUNvbmZpZ1trZXldID0gdmFsdWVcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHBsdWdpbnMgPSBhd2FpdCBpbXBvcnRQbHVnaW5zKHRyYW5zZm9ybS5wbHVnaW5zLCBnbG9iYWxDb25maWcsIHRyYW5zZm9ybUNvbmZpZylcblxuICAgICAgLy8gQ3JlYXRlIGEgcGx1Z2luIG1hcCBvZiBnbG9iYWwgYW5kIGxvY2FsIHBsdWdpbnNcbiAgICAgIGxldCBwbHVnaW5NYXAgPSBuZXcgTWFwPHN0cmluZywgSVBsdWdpbj4oKVxuXG4gICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgZ2xvYmFsUGx1Z2luTWFwKSB7XG4gICAgICAgICBwbHVnaW5NYXAuc2V0KGtleSwgdmFsdWUpXG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBsb2NhbCBwbHVnaW5zIGFmdGVyIHRvIFwib3ZlcnJpZGVcIiBnbG9iYWwgcGx1Z2luc1xuICAgICAgZm9yIChsZXQgbmFtZWQgb2YgcGx1Z2lucykge1xuICAgICAgICAgcGx1Z2luTWFwLnNldChuYW1lZC5uYW1lLCBuYW1lZC5wbHVnaW4pXG4gICAgICB9XG5cbiAgICAgIHBsdWdpbnMgPSBuZXcgQXJyYXk8TmFtZWRQbHVnaW4+KClcbiAgICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBwbHVnaW5NYXAuZW50cmllcygpKSB7XG4gICAgICAgICBwbHVnaW5zLnB1c2gobmV3IE5hbWVkUGx1Z2luKGtleSwgdmFsdWUpKVxuICAgICAgfVxuXG4gICAgICBsZXQgc3RlcHMgPSBhd2FpdCBpbXBvcnRQaXBlbGluZVN0ZXBzKG5hbWUsIHRyYW5zZm9ybS5zdGVwcywgdHJhbnNmb3JtQ29uZmlnLCBwbHVnaW5NYXApXG5cbiAgICAgIHJldHVybiBuZXcgRm9yZ2VQaXBlbGluZShuYW1lLCBwbHVnaW5zLCBzY3JpcHQsIHN0ZXBzLCBzZWFyY2hTY29wZSlcbiAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgZXJyXG4gICB9XG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXG4gKiBOb3JtYWxpemVzYW5kIGltcG9ydHMgdGhlIHBsdWdpbiBzZWN0aW9uIG9mIGEgdHJhbnNmb3JtXG4gKiBcbiAqIEBwYXJhbSB0cmFuc2Zvcm1OYW1lIHtzdHJpbmd9IFRoZSBuYW1lIG9mIHRoZSB0cmFuc2Zvcm1cbiAqIEBwYXJhbSBwbHVnaW5zIHsgQXJyYXkgfCBvYmplY3QgfSBUaGUgcGx1Z2lucyBjb25maWd1cmF0aW9uXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuYXN5bmMgZnVuY3Rpb24gaW1wb3J0UGx1Z2lucyhcbiAgIHBsdWdpbnM6IFBsdWdpbkVudHJ5IHwgUGx1Z2luRW50cnlbXSxcbiAgIGdsb2JhbENvbmZpZzogR2VuZXJpY09iamVjdCxcbiAgIGxvY2FsQ29uZmlnOiBHZW5lcmljT2JqZWN0ID0ge31cbik6IFByb21pc2U8QXJyYXk8TmFtZWRQbHVnaW4+PiB7XG4gICBsZXQgcmVzdWx0cyA9IG5ldyBBcnJheTxOYW1lZFBsdWdpbj4oKVxuXG4gICBpZiAoIWlzRGVmaW5lZChwbHVnaW5zKSkge1xuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgIH1cblxuICAgbGV0IGltcG9ydFBsdWdpbnMgPSBhc3luYyAoZW50cnk6IFBsdWdpbkVudHJ5KTogUHJvbWlzZTxOYW1lZFBsdWdpbltdPiA9PiB7XG4gICAgICBpZiAodHlwZW9mIGVudHJ5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgbGV0IHsgbmFtZSwgcGx1Z2luIH0gPSBlbnRyeVxuXG4gICAgICAgICBpZiAoIWlzRGVmaW5lZChuYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQbHVnaW4gbmFtZSBpcyBtaXNzaW5nLiBFbnN1cmUgYWxsIHBsdWdpbnMgaGF2ZSBhICduYW1lJyBkZWZpbmVkYClcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYgKCFpc0RlZmluZWQocGx1Z2luKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIFBsdWdpbiBlbnRyeSBpcyBtaXNzaW5nIHRoZSBvaCBzbyB2ZXJ5IGltcG9ydGFudCAncGx1Z2luJyBwcm9wZXJ0eS4gRW5zdXJlIGFsbCBwbHVnaW5zIGhhdmUgdGhlaXIgJ3BsdWdpbicgZmllbGQgcG9wdWxhdGVkLmApXG4gICAgICAgICB9XG5cbiAgICAgICAgIHJldHVybiBbbmV3IE5hbWVkUGx1Z2luKG5hbWUsIHBsdWdpbildXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbnRyeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgbGV0IGNhc3RFbnRyeSA9IGVudHJ5IGFzIChnbG9iYWw6IEdlbmVyaWNPYmplY3QsIGxvY2FsOiBHZW5lcmljT2JqZWN0KSA9PiBQcm9taXNlPE5hbWVkUGx1Z2luIHwgTmFtZWRQbHVnaW5bXT5cbiAgICAgICAgIGxldCBlbnRyaWVzID0gYXdhaXQgY2FzdEVudHJ5KGdsb2JhbENvbmZpZywgbG9jYWxDb25maWcpXG5cbiAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShlbnRyaWVzKSkge1xuICAgICAgICAgICAgZW50cmllcyA9IFtlbnRyaWVzXVxuICAgICAgICAgfVxuXG4gICAgICAgICByZXR1cm4gZW50cmllcy5tYXAoaXQgPT4gbmV3IE5hbWVkUGx1Z2luKGl0Lm5hbWUsIGl0LnBsdWdpbikpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdXRuZXJlZCBhIHBsdWdpbiBlbnRyeSB0aGF0IGlzIG5vdCBpbiB0aGUgZXhwZWN0ZWQgZm9ybWF0LiBQbHVnaW4gZW50cmllcyBhcmUgZWl0aGVyIGZ1bmN0aW9ucyBvciBvYmplY3RzLmApXG4gICAgICB9XG4gICB9XG5cbiAgIGlmIChBcnJheS5pc0FycmF5KHBsdWdpbnMpKSB7XG4gICAgICBwbHVnaW5zID0gcGx1Z2lucyBhcyBBcnJheTxQbHVnaW5FbnRyeT5cblxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgcGx1Z2lucykge1xuICAgICAgICAgcmVzdWx0cy5wdXNoKC4uLihhd2FpdCBpbXBvcnRQbHVnaW5zKGVudHJ5KSkpXG4gICAgICB9XG4gICB9IGVsc2UgaWYgKHR5cGVvZiBwbHVnaW5zID09PSAnb2JqZWN0Jykge1xuICAgICAgcmVzdWx0cy5wdXNoKC4uLihhd2FpdCBpbXBvcnRQbHVnaW5zKHBsdWdpbnMpKSlcbiAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdCBlbmNvdW50ZXJlZCB3aGVuIGltcG9ydGluZyBwbHVnaW5zLiBFbnN1cmUgZWFjaCBwbHVnaW4gZW50cnkgaGFzIGEgJ25hbWUnIGFuZCAncGx1Z2luJyBmaWVsZC5gKVxuICAgfVxuXG4gICByZXR1cm4gcmVzdWx0c1xufVxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxuICogSW1wb3J0cyB0aGUgVHJhbnNmb3JtIFNjcmlwdC4gV2lsbCByZWFkIGl0IGluIGZyb20gZGlzayBpZiBwcm92aWRlZCBhcyBhIHBhdGgsIG90aGVyd2lzZSxcbiAqIGl0IHdpbGwgcmVhZCBpdCBpbiBmcm9tIG1lbW9yeS5cbiAqIFxuICogQHBhcmFtIHNjcmlwdCB7c3RyaW5nIHwgb2JqZWN0fSBUaGUgc2NyaXB0IHRvIGltcG9ydFxuICogQHBhcmFtIGNvbnRleHQgVGhlIEZvcmdlT3B0aW9uc0NvbnRleHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRTY3JpcHQoc2NyaXB0OiBzdHJpbmcgfCBJRm9yZ2VTY3JpcHQsIHNjb3BlOiBGaWxlU2VhcmNoU2NvcGUpOiBQcm9taXNlPElGb3JnZVNjcmlwdD4ge1xuICAgaWYgKHR5cGVvZiBzY3JpcHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAocGF0aC5pc0Fic29sdXRlKHNjcmlwdCkpIHtcbiAgICAgICAgIHJldHVybiBhd2FpdCBpbXBvcnQoc2NyaXB0KVxuICAgICAgfVxuXG4gICAgICBsZXQgZm91bmQgPSBhd2FpdCBzY29wZS5maW5kKHNjcmlwdClcblxuICAgICAgaWYgKGZvdW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgc2NyaXB0ICR7c2NyaXB0fS4gRW5zdXJlIHRoZSBjb3JyZWN0IHJlc29sdmVzIGV4aXN0IG9yIHRoYXQgdGhlIHNjcmlwdCBpcyBiZWluZyBjYWxsZWQgZnJvbSB0aGUgZGVzaXJlZCBsb2NhdGlvbi5gKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXdhaXQgaW1wb3J0KGZvdW5kKVxuICAgfSBlbHNlIGlmICh0eXBlb2Ygc2NyaXB0ID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHNjcmlwdCBhcyBJRm9yZ2VTY3JpcHRcbiAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IEVtcHR5Rm9yZ2VTY3JpcHQoKVxuICAgfVxufVxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxuICogSW1wb3J0cyB0aGUgUGlwZWxpbmUgU3RlcHNcblxuICogQHBhcmFtIHRyYW5zZm9ybU5hbWUgVFJhbnNmb3JtIG5hbWVcbiAqIEBwYXJhbSBzdGVwcyBMaXN0IG9mIHBsYWluIG9iamVjdCBTdGVwc1xuICogQHBhcmFtIHRyYW5zZm9ybUNvbmZpZyBUaGUgdHJhbnNmb3JtIGNvbmZpZyB0aGF0IHdhcyBnZW5lcmF0ZWQgYnkgXG4gKiAgICBydW5uaW5nIHRoZSBpbml0KCkgdHJhbnNmb3JtIHNjcmlwdFxuICogQHBhcmFtIHBsdWdpbk1hcCBNYXAgb2YgcGx1Z2lucyBieSBuYW1lIChnbG9iYWwgKyBsb2NhbClcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRQaXBlbGluZVN0ZXBzKHRyYW5zZm9ybU5hbWU6IHN0cmluZywgc3RlcHM6IFN0ZXBFbnRyeVtdLCB0cmFuc2Zvcm1Db25maWc6IEdlbmVyaWNPYmplY3QsIHBsdWdpbk1hcDogTWFwPHN0cmluZywgSVBsdWdpbj4pOiBQcm9taXNlPElTdGVwW10+IHtcbiAgIGxldCByZXN1bHRzID0gbmV3IEFycmF5PElTdGVwPigpXG5cbiAgIGZvciAobGV0IHN0ZXAgb2Ygc3RlcHMpIHtcbiAgICAgIGxldCBpbXBvcnRlZFN0ZXA6IFN0ZXBJbmZvIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgICAgIGlmICh0eXBlb2Ygc3RlcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgaW1wb3J0ZWRTdGVwID0gYXdhaXQgc2FmZWx5UnVuPFN0ZXBJbmZvPihzdGVwLCB7IGNvbmZpZzogdHJhbnNmb3JtQ29uZmlnIH0pXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdGVwID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgaW1wb3J0ZWRTdGVwID0gc3RlcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQSBUcmFuc2Zvcm0gc3RlcCBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgYW4gb2JqZWN0LiBFbmNvdXRuZXJlZCBhICR7dHlwZW9mIHN0ZXB9IGluc3RlYWQgaW4gdHJhbnNmb3JtICR7dHJhbnNmb3JtTmFtZX1gKVxuICAgICAgfVxuXG4gICAgICBpZiAoaW1wb3J0ZWRTdGVwID09IG51bGwpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGltcG9ydCBhIHN0ZXAgaW4gdGhlIHRyYW5zZm9ybSAke3RyYW5zZm9ybU5hbWV9YClcbiAgICAgIH1cblxuICAgICAgU3RlcC52YWxpZGF0ZShpbXBvcnRlZFN0ZXApXG5cbiAgICAgIGxldCBwbHVnaW4gPSBwbHVnaW5NYXAuZ2V0KGltcG9ydGVkU3RlcC5wbHVnaW4pXG5cbiAgICAgIGlmIChwbHVnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBwbHVnaW4gJHtpbXBvcnRlZFN0ZXAucGx1Z2lufSBpbiBTdGVwICR7aW1wb3J0ZWRTdGVwLmFsaWFzfWApXG4gICAgICB9XG5cbiAgICAgIHJlc3VsdHMucHVzaChuZXcgU3RlcChpbXBvcnRlZFN0ZXAsIHBsdWdpbiwgaW1wb3J0ZWRTdGVwLnVzZSB8fCBuZXcgQXJyYXk8U3RyaW5nPigpKSlcbiAgIH1cblxuICAgcmV0dXJuIHJlc3VsdHNcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW1wb3J0UmVzb2x2ZShcbiAgIHJlc29sdmU6IHN0cmluZyB8IHN0cmluZ1tdIHwgUmVzb2x2ZVBhdGhzRm4gfCB1bmRlZmluZWQsXG4gICBvcHRpb25zOiBGb3JnZU9wdGlvbnMpOiBQcm9taXNlPEZpbGVTZWFyY2hTY29wZT4ge1xuICAgbGV0IHJlc29sdmVzID0gbmV3IEFycmF5PHN0cmluZz4oKVxuXG4gICBpZiAocmVzb2x2ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbmV3IEZpbGVTZWFyY2hTY29wZShyZXNvbHZlcylcbiAgIH1cblxuICAgbGV0IGFic29sdXRlID0gKHA6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICByZXR1cm4gcGF0aC5pc0Fic29sdXRlKHApID8gcCA6IHBhdGguam9pbihvcHRpb25zLmN3ZCwgcClcbiAgIH1cblxuICAgaWYgKHR5cGVvZiByZXNvbHZlID09PSAnc3RyaW5nJykge1xuICAgICAgcmVzb2x2ZXMgPSBbKGFic29sdXRlKHJlc29sdmUpKV1cbiAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc29sdmUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGV0IHBhdGhzID0gYXdhaXQgcmVzb2x2ZSgpXG4gICAgICBmb3IgYXdhaXQgKGxldCBwIG9mIHBhdGhzKSB7XG4gICAgICAgICByZXNvbHZlcy5wdXNoKGFic29sdXRlKHApKVxuICAgICAgfVxuICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJlc29sdmUpKSB7XG4gICAgICByZXNvbHZlcyA9IHJlc29sdmUubWFwKHAgPT4gYWJzb2x1dGUocCkpXG4gICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCByZXNvbHZlIGZvcm1hdCBlbmNvdW50ZXJlZC4gJ3Jlc29sdmUnIG11c3QgYmUgYSBzdHJpbmcsIHN0cmluZ1tdLCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJtbnMgYSBzdHJpbmdbXWApXG4gICB9XG5cbiAgIHJldHVybiBuZXcgRmlsZVNlYXJjaFNjb3BlKHJlc29sdmVzKVxufVxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxuICogSW1wb3J0cyB0aGUgaW1wb3J0cyBzZWN0aW9uIG9mIGEgVHJhbnNmb3JtXG4gKlxuICogQHBhcmFtIHRyYW5zZm9ybU5hbWUgVGhlIG5hbWUgb2YgdGhlIGltcG9ydGluZyB0cmFuc2Zvcm1cbiAqIEBwYXJhbSBpbXBvcnRzIFRoZSBpbXBvcnRzIG9iamVjdFxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIGZ1bmN0aW9uIGltcG9ydFRyYW5zZm9ybUltcG9ydHModHJhbnNmb3JtTmFtZTogc3RyaW5nLCBpbXBvcnRzOiBhbnksIGdsb2JhbFBsdWdpbk1hcDogTWFwPHN0cmluZywgSVBsdWdpbj4pOiBBcnJheTxJSW1wb3J0UGFyYW1zPiB7XG4vLyAgICBsZXQgcmVzdWx0cyA9IG5ldyBBcnJheTxJSW1wb3J0UGFyYW1zPigpXG5cbi8vICAgIC8qXG4vLyAgICAgICBSZXF1aXJlZCBwYXJhbWV0ZXJzOlxuLy8gICAgICAgICAgLSBhbGlhcyB7c3RyaW5nfSBUaGUgYWxpYXMgb2YgdGhpcyBpbXBvcnQgcGFyYW1ldGVyc1xuLy8gICAgICAgICAgLSBwbHVnaW4ge3N0cmluZyB8IElQbHVnaW59OiBUaGUgcGx1Z2luIHVzZWQgZm9yIGltcG9ydGluZyBcbi8vICAgICovXG4vLyAgICBsZXQgaW1wb3J0RW50cnkgPSBpbSA9PiB7XG4vLyAgICAgICBsZXQgcmVzdWx0ID0gey4uLmltfVxuXG4vLyAgICAgICBpZighaXNEZWZpbmVkKGltLmFsaWFzKSkge1xuLy8gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyAnYWxpYXMnIGRlZmluZWQgZm9yIGltcG9ydCBpbiB0cmFuc2Zvcm0gJHt0cmFuc2Zvcm1OYW1lfWApXG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmKCFpc0RlZmluZWQoaW0ucGx1Z2luKSkge1xuLy8gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyAncGx1Z2luJyBkZWZpbmVkIGZvciBpbXBvcnQgaW4gdHJhbnNmb3JtICR7dHJhbnNmb3JtTmFtZX1gKVxuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZih0eXBlb2YgaW0ucGx1Z2luID09PSAnc3RyaW5nJykge1xuLy8gICAgICAgICAgLy8gTG9va3VwIHRoZSByZWZlcmVuY2VkIHBsdWdpblxuLy8gICAgICAgICAgbGV0IGZvdW5kID0gZ2xvYmFsUGx1Z2luTWFwLmdldChpbS5wbHVnaW4pXG5cbi8vICAgICAgICAgIGlmKCFpc0RlZmluZWQoZm91bmQpKSB7XG4vLyAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kICdwbHVnaW4nICR7aW0ucGx1Z2lufSByZWZlcmVuY2VkIGluIHRoZSBpbXBvcnQgc2VjdGlvbiBpbiB0cmFuc2Zvcm0gJHt0cmFuc2Zvcm1OYW1lfWApXG4vLyAgICAgICAgICB9XG5cbi8vICAgICAgICAgIHJlc3VsdC5wbHVnaW4gPSBmb3VuZFxuLy8gICAgICAgfSBlbHNlIGlmIChpc1BsdWdpbihpbS5wbHVnaW4pKSB7XG4vLyAgICAgICAgICByZXN1bHQucGx1Z2luID0gaW0ucGx1Z2luXG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBmb3JtYXQgZm9yIHRoZSAncGx1Z2luJyByZWZlcmVuY2VkIGluIHRoZSBpbXBvcnQgaW4gdHJhbnNmb3JtICR7dHJhbnNmb3JtTmFtZX1gKVxuLy8gICAgICAgfVxuXG4vLyAgICAgICByZXR1cm4gcmVzdWx0IGFzIElJbXBvcnRQYXJhbXNcbi8vICAgIH1cblxuLy8gICAgaWYoaXNEZWZpbmVkKGltcG9ydHMpKSB7XG4vLyAgICAgICBpZihBcnJheS5pc0FycmF5KGltcG9ydHMpKSB7XG4vLyAgICAgICAgICByZXN1bHRzID0gaW1wb3J0cy5tYXAoaXQgPT4gaW1wb3J0RW50cnkoaXQpKVxuLy8gICAgICAgfSBlbHNlIGlmKHR5cGVvZiBpbXBvcnRzID09PSAnb2JqZWN0Jykge1xuLy8gICAgICAgICAgcmVzdWx0cy5wdXNoKGltcG9ydEVudHJ5KGltcG9ydHMpKVxuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0IGVuY291bnRlcmVkIHdoZW4gaW1wb3J0aW5nIHRoZSBpbXBvcnRzIHNlY3Rpb24gZm9yIHRyYW5zZm9ybSAke25hbWV9YClcbi8vICAgICAgIH1cbi8vICAgIH1cblxuLy8gICAgcmV0dXJuIHJlc3VsdHNcbi8vIH1cblxuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXG4gKiBJbXBvcnRzIHRoZSBleHBvcnQgcG9ydGlvbiBvZiBhIHRyYW5zZm9ybVxuICpcbiAqIEBwYXJhbSB0cmFuc2Zvcm1OYW1lIFRoZSB0cmFuc2Zvcm0gbmFtZVxuICogQHBhcmFtIGV4cG9ydHMgTGlzdCBvZiBleHBvcnQgcGFyYW1ldGVyc1xuICogQHBhcmFtIGdsb2JhbFBsdWdpbk1hcCBHbG9iYWwgbWFwIG9mIGFsaWFzLXRvLXBsdWdpbiBlbnRyaWVzXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gZnVuY3Rpb24gaW1wb3J0VHJhbnNmb3JtRXhwb3J0cyhcbi8vICAgIHRyYW5zZm9ybU5hbWU6IHN0cmluZyxcbi8vICAgIGV4cG9ydHM6IGFueSxcbi8vICAgIGdsb2JhbFBsdWdpbk1hcDogTWFwPHN0cmluZywgSVBsdWdpbj4pOiBBcnJheTxJRXhwb3J0UGFyYW1zPiB7XG5cbi8vICAgIGxldCByZXN1bHRzID0gbmV3IEFycmF5PElFeHBvcnRQYXJhbXM+KClcblxuLy8gICAgaWYoIWlzRGVmaW5lZChleHBvcnRzKSkge1xuLy8gICAgICAgcmV0dXJuIG5ldyBBcnJheTxJRXhwb3J0UGFyYW1zPigpICAgXG4vLyAgICB9XG5cbi8vICAgIC8qXG4vLyAgICAgICBSZXF1aXJlZCBwYXJhbWV0ZXJzOlxuLy8gICAgICAgICAgLSBhbGlhcyB7c3RyaW5nfSBUaGUgYWxpYXMgb2YgdGhpcyBleHBvciBwYXJhbWV0ZXJzXG4vLyAgICAgICAgICAtIHBsdWdpbiB7c3RyaW5nIHwgSVBsdWdpbn06IFRoZSBwbHVnaW4gdXNlZCBmb3IgZXhwb3J0aW5nXG5cbi8vICAgICAgIE9wdGlvbmFsOlxuLy8gICAgICAgICAgLSB1c2Uge3N0cmluZyB8IEFycmF5PGF0cmluZz59OiBSZWZlcmVuY2VzIHRvIHRoZSBpbXBvcnRlZCBFbnZveSBhbGlhc2VzXG4vLyAgICAqL1xuLy8gICAgbGV0IGltcG9ydEVudHJ5ID0gZXggPT4ge1xuLy8gICAgICAgbGV0IHJlc3VsdCA9IHsgLi4uZXggfVxuXG4vLyAgICAgICBpZighaXNEZWZpbmVkKGV4LmFsaWFzKSkge1xuLy8gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyAnYWxpYXMnIGRlZmluZWQgZm9yIHRoZSBleHBvcnQgaW4gdHJhbnNmb3JtICR7dHJhbnNmb3JtTmFtZX1gKVxuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZighaXNEZWZpbmVkKGV4LnBsdWdpbikpIHtcbi8vICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gJ3BsdWdpbicgZGVmaW5lZCBmb3IgdGhlIGV4cG9ydCBpbiB0cmFuc2Zvcm0gJHt0cmFuc2Zvcm1OYW1lfWApXG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmKHR5cGVvZiBleC5wbHVnaW4gPT09ICdzdHJpbmcnKSB7XG4vLyAgICAgICAgICAvLyBMb29rdXAgdGhlIHJlZmVyZW5jZWQgcGx1Z2luXG4vLyAgICAgICAgICBsZXQgZm91bmQgPSBnbG9iYWxQbHVnaW5NYXAuZ2V0KGV4LnBsdWdpbilcblxuLy8gICAgICAgICAgaWYoIWlzRGVmaW5lZChmb3VuZCkpIHtcbi8vICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgJ3BsdWdpbicgJHtleC5wbHVnaW59IHJlZmVyZW5jZWQgaW4gdGhlIGV4cG9ydCBzZWN0aW9uIGluIHRyYW5zZm9ybSAke3RyYW5zZm9ybU5hbWV9YClcbi8vICAgICAgICAgIH1cblxuLy8gICAgICAgICAgcmVzdWx0LnBsdWdpbiA9IGZvdW5kXG4vLyAgICAgICB9IGVsc2UgaWYgKGlzUGx1Z2luKGV4LnBsdWdpbikpIHtcbi8vICAgICAgICAgIHJlc3VsdC5wbHVnaW4gPSBleC5wbHVnaW5cbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdCBmb3IgdGhlICdwbHVnaW4nIHJlZmVyZW5jZWQgaW4gdGhlIGltcG9ydCBpbiB0cmFuc2Zvcm0gJHt0cmFuc2Zvcm1OYW1lfWApXG4vLyAgICAgICB9XG5cbi8vICAgICAgIGxldCB1c2UgPSBuZXcgQXJyYXk8eyBhbGlhczogc3RyaW5nLCBlbnZveTogSUVudm95IH0+KClcblxuLy8gICAgICAgaWYoZXgudXNlKSB7XG4vLyAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShleC51c2UpICYmIHR5cGVvZiBleC51c2UgIT09ICdzdHJpbmcnKSB7XG4vLyAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkICd1c2UnIG9wdGlvbiB0eXBlIHJlZmVyZW5jZWQgaW4gdGhlIGV4cG9ydCBzZWN0aW9uIG9mIHRyYW5zZm9ybSAke3RyYW5zZm9ybU5hbWV9LiBJdCBtdXN0IGJlIGEgc3RyaW5nIG9yIGFuIEFycmF5PHN0cmluZz4uYClcbi8vICAgICAgICAgIH1cblxuLy8gICAgICAgICAgaWYodHlwZW9mIGV4LnVzZSA9PT0gJ3N0cmluZycpIHtcbi8vICAgICAgICAgICAgIHVzZS5wdXNoKHsgYWxpYXM6IGV4LnVzZSwgZW52b3k6IG51bGwgfSlcbi8vICAgICAgICAgIH0gZWxzZSBpZihBcnJheS5pc0FycmF5KGV4LnVzZSkpIHtcbi8vICAgICAgICAgICAgIGZvcihsZXQgYWxpYXMgb2YgZXgudXNlKSB7XG4vLyAgICAgICAgICAgICAgICB1c2UucHVzaCh7IGFsaWFzLCBlbnZveTogbnVsbCB9KVxuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBmb3JtYXQgZW5jb3VudGVyZWQgZm9yIHRoZSBleHBvcnQgJ3VzZScgb3B0aW9uIGluIHRyYW5zZm9ybSAke3RyYW5zZm9ybU5hbWV9LiBJdCBtdXN0IGJlIGEgc3RyaW5nIG9yIGFuIEFycmF5PHN0cmluZz4uYClcbi8vICAgICAgICAgIH1cbi8vICAgICAgIH1cblxuLy8gICAgICAgcmVzdWx0LnVzZSA9IHVzZVxuXG4vLyAgICAgICByZXR1cm4gcmVzdWx0IGFzIElFeHBvcnRQYXJhbXNcbi8vICAgIH1cblxuLy8gICAgaWYoQXJyYXkuaXNBcnJheShleHBvcnRzKSkge1xuLy8gICAgICAgZm9yKGxldCBleHAgb2YgZXhwb3J0cykge1xuLy8gICAgICAgICAgcmVzdWx0cy5wdXNoKGltcG9ydEVudHJ5KGV4cCkpXG4vLyAgICAgICB9XG4vLyAgICB9IGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4vLyAgICAgICByZXN1bHRzLnB1c2goaW1wb3J0RW50cnkoZXhwb3J0cykpXG4vLyAgICB9IGVsc2Uge1xuLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIGZvcm1hdCBmb3IgdGhlIGV4cG9ydHMgdmFsdWUgaW4gdHJhbnNmb3JtICR7dHJhbnNmb3JtTmFtZX0uIEl0IG5lZWRzIHRvOiBub3QgZXhpc3QsIGJlIGFuIG9iamVjdCBvciBhbiBBcnJheWApXG4vLyAgICB9XG5cbi8vICAgIHJldHVybiByZXN1bHRzXG4vLyB9XG5cbi8vIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXG4vLyAgKiBTZWFyY2hlcyBmb3IgYSBwbHVnaW4gZnJvbSB0aGUgc2NvcGUgb2YgYSBUcmFuc2Zvcm1cbi8vICAqIFxuLy8gICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIHBsdWdpbiB0byBmaW5kXG4vLyAgKiBAcGFyYW0gdHJhbnNmb3JtIFRoZSB0cmFuc2Zvcm1cbi8vICAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBmdW5jdGlvbiBmaW5kUGx1Z2luKG5hbWU6IHN0cmluZywgdHJhbnNmb3JtOiBGb3JnZVRyYW5zZm9ybSk6IElQbHVnaW4ge1xuLy8gICAgbGV0IGZvdW5kID0gdHJhbnNmb3JtLmZpbmRQbHVnaW4obmFtZSlcblxuLy8gICAgaWYoZm91bmQpIHtcbi8vICAgICAgIHJldHVybiBmb3VuZFxuLy8gICAgfVxuXG4vLyAgICBsZXQgZ2xvYmFsRm91bmQgPSB0aGlzLnBsdWdpbnMuZmluZChwbHVnaW4gPT4gcGx1Z2luLm5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpKVxuLy8gICAgcmV0dXJuIGdsb2JhbEZvdW5kID8gZ2xvYmFsRm91bmQucGx1Z2luIDogdW5kZWZpbmVkXG4vLyB9XG4iXX0=