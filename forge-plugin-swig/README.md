# forge-plugin-swig

A Swig templating plugin for `forge`. This plugin ingests data from a source and applies it to a swig template.

References:
* [Swig Docs](http://node-swig.github.io/swig-templates/docs/)
* [Swig Options](https://node-swig.github.io/swig-templates/docs/api/)
* [Git Repo](https://github.com/node-swig/swig-templates)
* [Default Custom Filter List](http://node-swig.github.io/swig-templates/docs/filters/)


# Installation

```bash
npm install @spikedpunch/forge-plugin-swig
```

# Usage

```js
//...
{
   alias: 'swigged',
   plugin: 'swig',
   use: 'data',
   // Provide an inline template
   template: `{{ data[0] | json(2) }}`,
   // Or a template file
   templateFile: 'relative/path/to/template',
   // Provide the single resulting file path
   outFile: 'built/data/exported.json',
   // Or provide a method to allow writing multiple files
   outFiles: string | (envoy: SwigEnvoy, state: IBuildState, data: any): Promise<void>
   outFiles: 'relative/path/to/file.js'
}
```

**outFiles**

`string`

If passed as a `string`, it's the path to a `.js` file with a single exported function with the signature: `(envoy: SwigEnvoy, state: IBuildState, data: any): Promise<void>`

`function`

A functionw ith the signature: `(envoy: SwigEnvoy, state: IBuildState, data: any): Promise<void>`



`forge.js`
```js

module.exports = {
   plugins: [
      { name: 'swig', plugin: new SwigPlugin() },
      { name: 'json', plugin: new JsonPlugin() }
   ],
   transforms: {
      swig: {
         steps: [
            {
               alias: 'files',
               plugin: 'json',
               paths: [
                  'path/to/files/**/*.json'
               ]
            },
            {
               alias: 'xform',
               plugin: 'swig',
               use: 'files',
               options: {
                  // Swig Options
               },
               // Inline template
               template: `{{ obj | json(2) }}`,
               // Or specify a template file
               templateFile: 'path/to/file.template',
               // Specify a resulting file path
               // You can still use this transformed data in another stream
               outFile: 'path/to/rendered/file.json'
            }
         ]
      }
   }
}

```

## Exports API

The Swig plugin applies data from a given source, and applies it to a Swig template. This plugin does not support an import option.

Besides the `alias`, `plugin`, and `use` parameters, the plugin also supports:

* `template` {string} : An inline template string. Mutually exclusive with the `templateFile` option.
* `templateFile` {string} : A relative path to the template file. Mutually exclusive with the `template` option.
* `out` {string, optional} : A relative path to the file to export the rendered text to.
* All other options defined in [SwigOpts](http://node-swig.github.io/swig-templates/docs/api/#SwigOpts)

If both the `template` and `templateFile` options are set, the `template` parameter takes precendence.

## Envoy API

The following methods are exposed on the Swig Envoy:
#### `setTemplateContext(context: any)`

Sets the context object for the Swig template
* `context` : The context object used when rendering

#### `setTemplate(template: string)`
Sets the Swig template string. Mutually exclusive with `setTemplateFile()`

* `template` : The template string

#### `setTemplateFile(filePath: string)`
Sets the template file used. This is mutually exclusive with `setTemplate()`. If both are set, the `template` string takes precendence.

* `filePath` : Relative path to the template file.

#### `setOutFile(filePath: string)`
Sets the out file path. If set, the plugin will export the rendered text to a file.

* `filePath` : Absolute or relative path to the resulting file

#### `setSwigOptions(options: any)`
Sets any additional [SwigOpts](http://node-swig.github.io/swig-templates/docs/api/#SwigOpts)

* `options` : The Swig options.


**Example**
```js
function beforeExport(state) {
   let { exports } = state

   // Inline template string
   let swig = exports.create('swig')
   swig.setTemplateContext({ say: 'Hey There!' })
   swig.setTemplate(`<h1>{{ say }}</h1>`)
   exports.commit(swig)

   // Template file
   swig = exports.create('swig')
   swig.setTemplateContext({ say: 'Hey There!' })
   swig.setTemplateFile('relative/path/to/template/file.template')
   exports.commit(swig)

   return Promise.resolve()
}
```

## Build Record

For each item exported, a record is kept. The plugin stores the following information:
* `template` : This is set if an inline template was used
* `templateFile` : This is set if a template file was used for the template. This is the absolute path to the file.
* `context` : The local context used when rendering the template
* `rendered` : The rendered text
