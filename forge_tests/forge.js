const { JsonPlugin } = require('@spikedpunch/forge-plugin-json')
const { SwigPlugin } = require('@spikedpunch/forge-plugin-swig')
const { RestPlugin } = require('@spikedpunch/forge-plugin-rest')
const { S3Plugin } = require('@spikedpunch/forge-plugin-s3')
const dotenv = require('dotenv')
const path = require('path')

/*
TODO:
   * When creating a Plugin, plugin should have the ability to be a function
     that gets config passed to it. This is to help developers pass creds
     to their plugins
*/

module.exports = {
   script: {
      init: async ({ env }) => {
         dotenv.config({ path: path.join(__dirname, '..', '.devconfig', '.env') })
         return {
            accessKey: env('AWS_ACCESS_KEY', 'aws-access-key-not-set'),
            secretAccessKey: env('AWS_SECRET_ACCESS_KEY', 'aws-secret-access-key-not-set')
         }
      }
   },
   plugins: [
      { name: 'json', plugin: new JsonPlugin() },
      { name: 'swig', plugin: new SwigPlugin() },
      {
         name: 'rest', plugin: new RestPlugin(
            'https://api.openbrewerydb.org', {
            headers: {
               'Keep-Alive': 'max=5',
               'User-Agent': '@spikedpunch/forge client'
            }
         })
      },
      { name: 'rest-no-url', plugin: new RestPlugin() },
      async (globalConfig) => {
         return {
            name: 's3',
            plugin: new S3Plugin({
               accessKeyId: globalConfig.accessKey,
               secretAccessKey: globalConfig.secretAccessKey,
               region: 'us-west-2'
            })
         }
      }
   ],
   pipelines: {
      test: {
         steps: [
            {
               alias: 'breweries',
               plugin: 'rest',
               verb: 'get',
               path: '/breweries'
            },
            {
               alias: 'breweries-ca',
               plugin: 'rest',
               verb: 'get',
               path: 'breweries?by_state=california'
            },
            {
               alias: 'rick-morty-multiple',
               plugin: 'rest-no-url',
               debug: true,
               requests: [
                  {
                     verb: 'get',
                     path: 'https://rickandmortyapi.com/api/location'
                  }
               ]
            },
            {
               alias: 'breweries-swig',
               plugin: 'swig',
               use: 'breweries',
               template: `{ "data": {{breweries | json(2)}} }`,
               outFile: 'built/resttest/breweries.json'
            },
            {
               alias: 'breweries-json1',
               plugin: 'json',
               use: 'breweries',
               outFile: 'built/resttest/breweries-json.json'
            },
            {
               alias: 'json-out',
               plugin: 'json',
               use: 'breweries-swig',
               outFile: 'built/breweries-json/breweries.json'
            },
            {
               alias: 'fn',
               plugin: ':fn',
               use: 'rick-morty-multiple',
               fn: async (chunk, encoding) => {
                  console.log('---------------------------')
                  console.log(`forge:fn`)
                  console.dir(chunk)
                  console.log('---------------------------')
                  return chunk
               }
            },
            {
               alias: 's3-up',
               plugin: 's3',
               use: 'breweries-ca',
               bucket: 'sports-players',
               key: '002.json'
            },
            {
               alias: 's3down',
               plugin: 's3',
               bucket: 'sports-players',
               key: '002.json'
            },
            {
               alias: 's3-json-out',
               plugin: 'json',
               use: 's3down',
               outFile: 'built/s3/breweries-ca-json.json'
            },
            {
               alias: 's3-out',
               plugin: 'swig',
               use: 's3down',
               template: `{ "data": {{ s3down | json(2)}} }`,
               outFile: 'built/s3/breweries-ca-s3.json'
            }
         ]
      }
   }
}