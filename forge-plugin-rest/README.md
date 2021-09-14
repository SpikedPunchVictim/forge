# forge-plugin-rest

An HTTP REST for forge. This plugin uses the [got](https://github.com/sindresorhus/got).

References:
* [List of `got` options](https://github.com/sindresorhus/got#options)


# Installation

```bash
npm install @spikedpunch/forge-plugin-rest
```

# Usage

```js
module.exports = {
   pipelines: {
      plugins: [
         { 
            name: 'rest', plugin: new RestPlugin({url: 'https://api.openbrewerydb.org'})
         },
      ],
      rest: {
         steps: [
            {
               // Read
               alias: 'get-breweries',
               plugin: 'rest',
               // If set will print out debug info
               debug: true,
               options: {
                  // Additional options to pass to the underlying http library
               },
               // Specify a single request inline
               verb: 'get',
               path: '/breweries',
               // Or multiple requests
               requests: [
                  {
                     verb: 'get',
                     path: 'breweries?by_tag=patio'
                  }
               ]
            },
            {
               // Write
               alias: 'write-breweries',
               plugin: 'rest',
               use: 'get-breweries',
               options: {
                  // Additional options to pass to the underlying http library
               },
               // Expect to write this data as json
               json: true,
               // Fictitious endpoint to store the data
               verb: 'post',
               path: '/brewerydb'
            }
         ]
      }
   }
}

```