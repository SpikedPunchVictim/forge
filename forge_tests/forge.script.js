const forge = require('@spikedpunch/forge')


async function main() {
   await forge.build({
      steps: [
         {
            alias: 'read',
            plugin: ':http',
            url: 'https://api.openbrewerydb.org/breweries'
         },
         {
            alias: 'console',
            use: 'read',
            plugin: ':fn',
            fn: async (chunk) => { console.log(JSON.stringify(chunk)) }
         }
      ]
   })
}

main()
   .then(_ => process.exit(0))
