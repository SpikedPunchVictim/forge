# forge-plugin-google

This plugin is a WIP. `write` mode does not work atm.

Google plugin for `forge`. The Google plugin provides 2 modes of operation: *read* and *write*.

*read* mode retrieves emails from the email account

*write* mode is currently a WIP, and does not function.
# Usage

```js
const { GooglePlugin, GoogleRateLimiter } = require('@spikedpunch/forge-plugin-google')

plugins: [
   { name: 'gmail', plugin: new GooglePlugin({
      email: 'admin@example.com',
      auth: {
         jwt: {
            credsFile: 'relative/path/to/creds.json'
         }
      }
   })}
],
steps: [
   {
      // For retrieving emails
      alias: 'gmail-get',
      plugin: 'gmail',
      // The user's email address. Set to 'me' to specify the authenticated user
      userId: 'me',
      // (Optional) Provide a list of labels to filter on
      labels: [
         'label1', 'label2'
      ],
      // (Optional) Provide a boolean that determines if Spam and Trash emails are included
      includeSpamTrash: true,
      // (Optional) Only retrieve a certain number of emails at a time. 0 is not a valid option
      maxResults: 50,
      // (Optional) Filter the results by using a query (https://support.google.com/mail/answer/7190?hl=en)
      query: 'after:2004/04/16',
      // (Optional) Provide a rate limiter
      rateLimiter: new GoogleRateLimiter(/**/)
   },
   {
      // For Sending emails
      alias: 'gmail-send',
      plugin: 'gmail'
      from: 'from@email.com',
      to: [
         'person1@email.com', 'person2@email.com'
      ],
      cc: [],  // Array | string of emails to CC
      bcc: [], // Array | string of emails to bcc
      subject: 'Email subject',
      // Can provide the body directly as a string
      body: `I'm a string body`,
      // Or can provide a stream
      body: {
         stream: 'stream-alias'  // This expects a text stream
      },
      // Attachments can take files or streams
      attachments: [
         { name: 'file.json', stream: 'stream-alias' },
         { name: 'file2.json', file: 'relative/path/to/file.json' }
      ],
      // Can also provide a single attachment
      attachments: {
         name: 'file1.json',
         stream: 'some-alias'
      }
   }
] 
```

# GooglePluginOptions

### **auth**
> object (*required*)

See the [auth](#auth) section below for more details.

### **email**
> string (*optional*, defaults to 'me')
 
The email address to read from.

### **rateLimiter**
> IGoogleRatelimiter (*optional*, provides one by default)

See the [rate limiter](#rate) documentation below for more details.

# Step

Two modes are supported: *read* and *write*.

## Read Mode

In *read* mode, emails are retrieved and forwarded to the next stream.

### *userId*
> string

The email address to read from. If G-Suite Domain-wide delegation is enabled, it's the email address that will be impersonated.


### *labels*
>string | string[]

This is a list of email labels to filter on


### *includeSpamTrash*
> boolean

If set to true, will include emails from the Spam and Trash folders in the results.


### *maxResults*
> number

The number of emails to retrieve at a time. Tweak this value if you want to tune performance. 0 (zero) or less is not a valid option.


### *query*
> string

A query string to filter messages on. Google's documentation is not that great for this parameter ([docs](https://developers.google.com/gmail/api/guides/filtering)). Some examples include:

* `in:sent after:2014/01/01 before:2014/02/01`
* `from:someuser@example.com rfc822msgid:<somemsgid@example.com> is:unread`

### *rateLimiter*
> IGoogleRateLimiter (*optional*, defaults to using the one provided by the plugin)

See the [rate limiter](#rate) documentation below for more details.

&nbsp;
# Auth <a name="auth"></a>

Configuring GMail authentication is done using the `auth` key, with the type of authentication as the name of a child key.

For example:

```js
// JWT Authentication
new GooglePlugin({
      email: 'admin@example.com',
      auth: {
         jwt: {
            credsFile: 'relative/path/to/creds.json'
         }
      }
   })

// OAuth2
new GooglePlugin({
      email: 'admin@example.com',
      auth: {
         oauth2: {
            clientId: 'xxxxxxx',
            clientSecret: 'xxxxxxx',
            refreshToken: 'xxxxxx'
         }
      }
   })

```
## JWT

This uses JWT for authentication, and assumes you have setup your Google project to use JWT authentication.

### *credsFile*
> string

A relative path to the service account credentials file containing the private key, service account email, etc. This is what is downloaded from the Google developer console.

*Example*

```js
plugins: [
   { 
      name: 'gmail',
      plugin: new GmailPlugin({
         auth: {
            jwt: {
               credsFile: 'creds/gmail.json'
            }
         },
         email: 'admin@example.com'
      })
   }
]
```

&nbsp;

# Google Rate Limiter <a name="rate"></a>

A Google API rate limiter is used to ensure the API calls are within the Google APIs rate limits. By default, each `forge-plugin-google` step will get its own rate limiter. If you have several steps using the same plugin, with the same credentials, you will want to provide a rateLimiter, and ensure it's shared across the multiple steps. This ensures that all steps stay within the rate limits.

Optionally, you can provide your own rate limiter by implementing the `IGoogleRateLimiter` interface exposed by this plugin.


*Example*

```js
let { GoogleRateLimiter } = require('@spikedpunch/forge-plugin-google')

let rateLimiter = new GoogleRateLimiter(250, 1000000000)

module.exports = {
   //...
   // Both steps will share the rate limiter
   steps: [
      {
         alias: 'gmail1',
         plugin: 'gmail'
         rateLimiter: rateLimiter
      },
      {
         alias: 'gmail2',
         plugin: 'gmail'
         rateLimiter: rateLimiter
      }
   ]
}
```