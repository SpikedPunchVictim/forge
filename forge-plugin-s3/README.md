# forge-plugin-s3

An S3 plugin for `forge`

# Usage

```js
//...
plugins: [
   { name: 's3', plugin: new S3Plugin({
      accessKeyId: 'XXXX'
      secretAccessKey: 'XXXX',
      region: 'us-west-2'
   })}
],
// Step
{
   alias: 's3',
   plugin: 's3',
   // If 'use' is provided, this will write to S3, otherwise
   // this will read from S3
   use: 'xxx',
   // (Optional) accessKeyId, accessKeyId, and region must be provided here
   // or in the Plugin's constructor
   accessKeyId: 'XXX'
   secretAccessKey: 'XXX'
   region: 'us-west-2',
   // (Required) the bucket name
   bucket: 's3-bucket-name',
   // (Required) The key
   key: 's3-key',
   // Optional S3.ClientConfiguration options
   s3Options: {}
}
```