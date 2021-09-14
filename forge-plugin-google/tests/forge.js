const { GmailPlugin } = require('../dist/Plugin')
const { SwigPlugin } = require('../../forge-plugin-swig/dist/plugin')

module.exports = {
   plugins: [
      {
         name: 'gmail',
         plugin: new GmailPlugin({
            auth: {
               jwt: {
                  credsFile: 'creds2.json'
               }
            },
            email: 'datasubjectrequests@twilio.com'
         })
      },
      { name:'swig', plugin: new SwigPlugin() }
   ],
   pipelines: {
      test: {
         steps: [
            {
               alias: 'read',
               plugin: 'gmail',
               query: 'after: 2021/01/02',
               includeAttachments: true
            },
            {
               alias: 'hold',
               plugin: 'forge:buffer',
               use: 'read',
               size: -1,
               object: true
            },
            {
               alias: 'gmail-export',
               plugin: 'swig',
               use: 'hold',
               template: `{ "data": {{hold | json(2)}} }`,
               outFile: 'built/emails.json'
            },
         ]
      }
   }
}