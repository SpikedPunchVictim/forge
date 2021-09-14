module.exports = {
   pipelines: {
      test: {
         steps: [
            {
               alias: 'one',
               plugin: ':http',
               verb: 'get',
               url: 'https://api.openbrewerydb.org/breweries'
            },
            {
               alias: 'write',
               plugin: ':fn',
               use: 'one',
               fn: async (chunk, encoding) => {
                  // Do some transform
                  console.group(chunk)
               }
            }
         ]
      }
   }
}