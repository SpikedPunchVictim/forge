import { S3WritableStream } from './Writable'

const fs = require('fs')
const path = require('path')

const Bucket = 'sports-players'
const Key = '001.json'
const AccessKeyId = 'AKIAQKMTSO2ILYPFIWZN'
const SecretAccessKey =  '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'
const Region = 'us-west-2'


async function main() {
   return new Promise((resolve, reject) => {
      let s3 = new S3WritableStream({
         accessKeyId: AccessKeyId,
         secretAccessKey: SecretAccessKey,
         region: Region,
         bucket: Bucket,
         key: Key
      })
      
      let read = fs.createReadStream(path.join(__dirname, '..', 'tsconfig.json'))
      
      read.pipe(s3)
      
      //read.on('data', data => console.log(data))
      
      s3.on('finish', () => {
         console.log(`Finsihed writing!`)
         resolve()
      })
      
      s3.on('error', (err) => {
         console.log(`Failed writing!`)
         reject(err)
      })
   })
}

main()
   .then(() => {
      console.log(`Success!`)
      process.exit(0)
   })
   .catch(err => {
      console.error(`Failed! ${err}`)
      process.exit(1)
   })
