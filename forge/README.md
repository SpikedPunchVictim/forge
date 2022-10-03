# forge

`forge` allows developers to quickly and easily setup a series of streams to move and transform data from various sources and destinations.

This tool and documentation are a work in progress.

# Usage

To use `forge`, we create a pipeline with a series of steps:

```js
import forge from '@spikedpunch/forge'

// Read from a rest endpoint, and write out the results to the console
await forge.build({
   steps: [
         {
            alias: 'brewery',    // An arbitrary name for this step
            plugin: ':http',     // The plugin to use. Forge has built in plugins like :http
            url: 'https://api.openbrewerydb.org/breweries'
         },
         {
            alias: 'console',    // This step's name
            use: 'brewery',      // Read the data from the 'brewery' stream
            plugin: ':fn',       // Custom plugin to define your stream inline
            fn: async (chunk) => { console.log(JSON.stringify(chunk)) }
         }
   ]
})
```


```js
// A complete use case
module.exports = {
   resolve: [  // Reference file paths in your config? This property helps resolve those paths
      'relative/path/to/files'
   ],
   init: async (configAssist) => {  
      // Perform some initialization before running
      // And collect your environment variables/secrets/etc to use later
      // Return an config object that can be used to create Plugins or configure Steps
   },
   plugins: [
      // Plugins extend forge's functionality.
      // They may write to S3, GMail, etc.
      // forge comes with a set of builtin plugins,
      // denoted with a ':' as the first letter of
      // the plugin name.
      { name: 'json', plugin: new JsonPlugin() },
      async (config) => {
         /* 
            return a named plugin or an Array of named plugins

            NamedPlugins have the shape:
               { name: <name>, plugin: SomePlugin() }
             
         */
      }
   ],
   pipelines: {
      xform: {    // The property name becomes the pipeline name
         resolve: [
            // These are used to resolve paths only in this pipeline
         ],
         steps: [
            // The pipeline's steps
         ]
      }
   }
}

```

The Pipelines can become as complex as you need them, with ReadStreams writing to multiple WriteStreams, and throw in some TransformStreams, and you can send your data anywhere and define the steps quickly. `forge` will build a Stream pipeline that will manage backpressure and error handling.

## Properties

* [resolve](#resolve)
* [init](#init)
* [plugins](#plugins)
* [pipelines](#pipelines)

### resolve <a name="resolve"></a>
> string | string[] | function(): Promise< string[] >  (*optional*)

Can be provided at the root or the pipeline level of options. It provides a set of paths to search when looking for a file that is referenced by the other options. These paths are relative to the *forge file*.

*Example*
```js
// Single path
resolve: 'realtive/path/to/files'

// Multiple paths
resolve: [
   'relative/path/one',
   'relative/path/two'
]

// Dynamically created
resolve: async() => {
   return [
      'relative/path/one',
      'relative/path/two'
   ]
}
```

### init <a name="init"></a>
> function(configAssist): any (*optional*)

Create any configuration object needed to run this *forge file*. The configuration object returned here is passed along to Plugin creation functions, or Step creation functions in pipelines. The `init` option can be used as a root level option, or at a pipeline level option.


*Example*
```js
// configAssist is a helper class provided by forge to make getting at environment variables easier
init: async (configAssist) => {
   return {
      password: configAssist.env('PASSWORD', 'password-not-set'),
      serverAuth: await configAssist.jsonFile('/path/to/config.json')
   }
}

// Shorthand
init: async ({env, jsonFile}) => {
   return {
      password: env('PASSWORD', 'password-not-set'),
      serverAuth: await jsonFile('/path/to/config.json')
   }
}
```

### plugins <a name="plugins"></a>
> Array< NamedPlugin > | object (*optional*)

The plugin(s) to use. These plugins are referenced in the `pipelines` Steps. See the documentation for the plugins on how they should be created.

`NamedPlugin` has the following properties:
   * **name** {string}: The name of the plugin that is used in the Steps to reference this instance
   * **plugin** {Plugin}: The plugin to use. See [forge plugins](#forge:plugins) for a list of plugins provided out of the box. More plugins are available in the forge repo.

Plugins can be specified as either an `object`, or created dynamically with a function.

When specifying plugin(s) with a function, the function has the signature:
> function(globalConfig: any, localConfig: any) => Promise < NamedPlugin | NamedPlugin[] >

* *globalConfig* {any}: The configuration object returned by a root level `init` option, or `{}` if one is not proivded.
* *localConfig* {any}: The configuration object returned by a pipeline level `init` option, or `{}` if not provided.

The return value should be a single or an Array of `NamedPlugin`.


*Example*
```js
// Single plugin
plugins: { name: 'rest', plugin: new RestPlugin() }

// Multple plugins
plugins: [
   { name: 'rest', plugin: new RestPlugin() },
   // Can also dynamically create plugins
   //    globalConfig is an object that comes from an init option at the root level
   //    localConfig is an object that comes from an init option at the pipeline level
   async (globalConfig, localConfig) => {
      return [
         { name: 'rest', plugin: new RestPlugin(localConfig.serverUri) },
         { name: 'json', plugin: new JsonPlugin() }
      ]
   }
]
```

### pipelines <a name="pipelines"></a>
> object (*required*)

A series of stream pipelines that are executed in parallel. Each key in the object defines the name of the pipeline, and its values define that pipeline.

Each pipeline has the following options:
* `init` (See [init](#init)): The config object returned here is only visible to this pipeline.
* `resolve` (See [resolve](#resolve)): The resolve paths are only visible to this pipeline.
* `steps` {Array< Step >}: A series of Steps that define each stream in the pipeline.

Let's break down `steps`. When we setup a stream pipeline, we define *read*, *write*, or *transform* streams. Each `step` defines one of these types of streams. Sometimes it's not obvious what type of stream a `step` defines. `forge` can figure this out for you based on how you're using it.

*For Example*
```js
// Read stream
{
   alias: 'name-of-the-step',    // required,
   plugin: 'name-of-the-plugin', // required
   prop1: 'property-specific-to-plugin',
   prop2: 'property-specific-to-plugin'
}

// Write or Transform stream
{
   alias: 'name-of-the-step',    // required,
   plugin: 'name-of-the-plugin', // required
   use: 'alias-of-step-to-get-data-from', // The stream we're expecting data from
   prop1: 'property-specific-to-plugin',
   prop2: 'property-specific-to-plugin'
}

// The only difference between Read/Write is the 'use' option
```

Each step must have an `alias`. This is what's used to reference a `step` in another `step`.

*For example*
```js
// Read data from a REST endpoint
{
   alias: 'read-data',
   plugin: 'rest',
   verb: 'get',
   path: 'http://example.com'
},
// Pipe the REST data into this next stream
{
   alias: 'write',
   plugin: ':fn',
   // Adding 'use' here pipes data from 'read-data' into this stream
   use: 'read-data',
   fn: async (chunk, encoding) => {
      console.dir(chunk, { depth: null })
   }
}
// Want to conitnue using the 'read-data'? Add another write stream
{
   alias: 'write-in-parallel',
   plugin: 'json',
   use: 'read-data'
}
```

These `step`s can be chained together in any way. A single `read` stream can be piped to multiple `write` streams. Some plugins support reeading from multiple streams at the same time.


TODO: Provide more details and examples.

## Forge Provided Plugins <a name="forge:plugins"></a>

`forge` itself provides its own *Step* plugins, without having to import packages. They have the notation `:<name>`.

Provided plugins:
* [:stream](#forge:stream)
* [:buffer](#forge:buffer)
* [:fn](#forge:fn)

&nbsp;
&nbsp;
### **:stream** <a name="forge:stream"></a>

`:stream` allows you to provide your own stream implementations. It assumes that you're aware of what type of stream you'll need (ie *Readable*, *Writable*, *Transform*, or *Passthrough*) by its expectation in the Step list. For example, if it has a `use` property, it becomes a *Writable* stream. If another stream `use`s it, it's a *Readable* stream. If it has both, it's a *Transform* stream.

**Example**
```js
{
   // A Readable stream
   alias: 'custom-stream',
   plugin: 'forge:stream',
   stream: new Readable({
      read(size) {
         // Read from a data source
      }
   })
}

{
   // A Writable stream
   alias: 'custom-stream',
   plugin: ':stream',
   use: 'some-data-stream',
   stream: new Writable({
      write(chunk, encoding, callback) {
         // Write data somewhere
      }
   })
}
```

**stream**
> Writable | Readable | Transform | Passthrough (*required*)

The stream to use for this *Step*.

&nbsp;
&nbsp;

### **:buffer** <a name="forge:buffer"></a>

`:buffer` stores data until the data meets the size requirement, at which point it will stream it forward. It operates in 3 different modes: `buffer`, `string`, and `object`. It auto-detects `buffer` and `string` modes. To put it into `object`mode, add the *object: true* property to the step.

**Example**
```js
// buffer/string mode
{
   alias: 'buffer'
   plugin: ':buffer',
   use: 'some-data-stream',
   size: 2048  // Will stream bytes 2048+ bytes at a time
}

// Object Mode
// Wait to receive 10 objects before streaming the data forward
{
   alias: 'buffer'
   plugin: ':buffer',
   use: 'some-data-stream',
   size: 10,
   object: true // Set to true for object mode, defaults to false
}
```

**size**
> number (*optional*, default 1024)

Streams out the data once the size of the data has reached this amount. When in `buffer` or `string` mode, this will be the number of bytes. When in `object` mode, this will be the number of objects.

**object**
> boolean (*optional*, default false) 

If set to `true`, will stream data in object mode. `size` will then reflect the number of objects, not bytes.

&nbsp;
&nbsp;
### **:fn** <a name="forge:fn"></a>

`:fn` inserts a function as a stream into the pipeline. There are two modes: *read* and *write*/*transform*

**Example**
```js
// Read mode, fn is an async generator
{
   alias: 'read',
   plugin: ':fn',
   fn: async* (size) => {
      for(let item of [1, 2, 3, 4, 5]) {
         yield item
      }
   },
   object: true   // optional parameter for object mode. default to true
},
// Write mode. Ingests data from another source
{
   alias: 'write',
   plugin: ':fn',
   use: 'read',
   fn: async (chunk, encoding) => {
      // Do some transform
      return result
   },
   object: true   // optional parameter for object mode. default to true
}
```


**fn**
> function*(size: number): Promise< any >
>
> function(chunk: any, encoding: string): Promise< any > 
>
> (*required*)

The function to call when processing the Step.

For *read* mode, use the Async Generator. Each value returned will be streamed out.

For *write* mode, each chunk will be passed to the function, along with the encoding. The return value, if any, is passed along to any streams downstream. This is a Transform stream, and is called each time for each chunk passed along.

**Example**
```js
{
   alias: 'fn',
   plugin: ':fn',

}
```

**object**
> boolean (*optional*, default true)

If set to *true*, will put the stream into object mode.

## TODOS
* Every plugin (where applicable) must offer a `streamOptions` property that will be passed to the underlying created stream.
* ConfigAssist API