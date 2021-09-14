# forge-plugin-json

A JSON plugin for `forge`

# Install

`npm install @spikedpunch/forge-plugin-json`

# Usage

```js
module.exports = {
   plugins: [
      { name: 'json', plugin: new JsonPlugin() }
   ],
   pipelines: {
      episodes: {
         steps: [
            {
               // Read Stream, reading from the provided files
               alias: 'import-episodes',
               plugin: 'json',
               files: [
                  'episodes/espisodes_a-d.json',
                  'episodes/espisodes_e-m.json',
                  'episodes/espisodes_n-z.json',
                  // Supports glob'd patterns too
                  'episodes/other/**/*.json'
               ]
            },
            {
               // Write stream, writing to a single file
               alias: 'write-episodes',
               use: 'import-episodes',
               plugin: 'json',
               outFile: 'built/episodes.json'
            }
         ]
      }
   }
}
```

# Read Stream

## `files` | string[]

List of JSON files to read from


## `mode` | string (one of: object, sax, chunk)

The read mode.

* `object`: Reads in a complete JSON object before streaming forward.
* `sax`: A SAX-like token stream defined by [stream-json](https://github.com/uhop/stream-json). The format can be found in their [docs](https://github.com/uhop/stream-json/wiki/Parser#stream-of-tokens).
* `chunk`: Individual text chunks read in individually.


# Write Stream

## `outFile` | string

Relative path to the file to be exported

# Envoy API

## `writeJson(filePath: string, data: any): Promise<void>`

Writes data to a file as JSON

## `async readJson(filePath: string): Promise<any>`

Reads data from a JSON file and imports it as an object.