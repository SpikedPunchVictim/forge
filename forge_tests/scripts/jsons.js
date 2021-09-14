const { JsonEnvoyEntry } = require('@spikedpunch/forge-plugin-json')
const path = require('path')

module.exports = {
   beforeExport
}

function beforeExport(state) {
   console.log(`--------------------------------------------------`)
   console.log('State:')
   console.dir(state)
   console.log('files')
   console.dir(state.imports.get('files').items)
   console.log(`--------------------------------------------------`)

   let { context } = state
   let envoy = state.exports.create('commit-from-script')
   let files = state.imports.get('files')
   envoy.items.push(new JsonEnvoyEntry(path.join(context.cwd, 'built/jsontest/exported-from-script.json'), files, { spaces: 2 }))

   state.exports.commit(envoy)


   return Promise.resolve()
}