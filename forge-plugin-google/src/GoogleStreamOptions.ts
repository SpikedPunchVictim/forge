import { GoogleRateLimiter, IGoogleRateLimiter } from "./RateLimiter"
import { StepInfo } from '@spikedpunch/forge'
import { GooglePluginOptions } from "./Plugin"
import { ReadableOptions, WritableOptions } from "readable-stream";

/*

   {
      // For retrieving emails
      alias: 'gmail-get',
      plugin: 'gmail',
      // (Optional) Provide a list of labels to filter on
      labels: [
         'label1', 'label2'
      ],
      // (Optional) Provide a boolean that determines if Spam and Trash emails are included
      includeSpamTrash: true,
      // (Optional) Only return a particular amount of emails
      maxResults: 0,
      // (Optional) Filter the results by using a query (https://support.google.com/mail/answer/7190?hl=en)
      query: 'after:2004/04/16',
      // (Optional) Provide a rate limiter
      rateLimiter: new GoogleRateLimiter(/**/

//)
   // },
   // {
   //    // For Sending emails
   //    alias: 'gmail-send',
   //    plugin: 'gmail'
   //    from: 'from@email.com',
   //    to: [
   //       'person1@email.com', 'person2@email.com'
   //    ],
   //    cc: [],  // Array | string of emails to CC
   //    bcc: [], // Array | string of emails to bcc
   //    subject: 'Email subject',
   //    // Can provide the body directly as a string
   //    body: `I'm a string body`,
   //    // Or can provide a stream
   //    body: {
   //       stream: 'stream-alias'  // This expects a text stream
   //    },
   //    // Attachments can take files or streams
   //    attachments: [
   //       { name: 'file.json', stream: 'stream-alias' },
   //       { name: 'file2.json', file: 'relative/path/to/file.json' }
   //    ]
   // }

//*/


export class GmailReadStreamOptions {
   labels: string[] = new Array<string>()
   includeSpamTrash: boolean = false
   includeAttachments: boolean = false
   maxResults: number = 50
   query: string = ''
   rateLimiter: IGoogleRateLimiter
   userId: string | undefined = undefined
   streamOptions: ReadableOptions = {}

   constructor() {
      // Reference: https://developers.google.com/gmail/api/reference/quota
      this.rateLimiter = new GoogleRateLimiter(250, 1000000000)
   }

   static fromStep(info: StepInfo, pluginOptions: GooglePluginOptions): GmailReadStreamOptions {
      let options = new GmailReadStreamOptions()

      if(info.labels != null) {
         if(typeof info.labels === 'string') {
            options.labels.push(info.labels)
         } else if(Array.isArray(info.labels)) {
            options.labels.push(...info.labels)
         } else {
            throw new Error(`The 'labels' option in a Gmail step is expected to be a tring or an Array<string>. Received ${typeof info.labels} instead.`)
         }
      }

      if(info.includeSpamTrash != null) {
         options.includeSpamTrash = info.includeSpamTrash == true
      }

      if(info.includeAttachments != null) {
         options.includeAttachments = info.includeAttachments
      }

      if(info.maxResults != null) {
         if(typeof info.maxResults !== 'number') {
            throw new Error(`The 'maxResults' option in a Gmail plugin is expected to be a number. Received ${typeof info.maxResults} instead.`)
         }

         options.maxResults = info.maxResults == 0 ? 50 : info.maxResults
      }

      if(info.userId != null) {
         if(typeof info.maxResults !== 'string') {
            throw new Error(`The 'userId' option in a Gmail plugin is expected to be a string. Received ${typeof info.userId} instead.`)
         }

         options.userId = info.userId
      } else {
         options.userId = pluginOptions.email
      }

      options.query = info.query || options.query
      options.rateLimiter = info.rateLimiter || options.rateLimiter

      if(info.streamOptions != null) {
         options.streamOptions = info.streamOptions
      }

      return options
   }
}


   //    from: 'from@email.com',
   //    to: [
   //       'person1@email.com', 'person2@email.com'
   //    ],
   //    cc: [],  // Array | string of emails to CC
   //    bcc: [], // Array | string of emails to bcc
   //    subject: 'Email subject',
   //    // Can provide the body directly as a string
   //    body: `I'm a string body`,
   //    // Or can provide a stream
   //    body: {
   //       stream: 'stream-alias'  // This expects a text stream
   //    },
   //    // Attachments can take files or streams
   //    attachments: [
   //       { name: 'file.json', stream: 'stream-alias' },
   //       { name: 'file2.json', file: 'relative/path/to/file.json' }
   //    ]


export class StreamRef {
   readonly alias: string

   constructor(alias: string) {
      this.alias = alias
   }
}

export enum Attachment {
   File = 'file',
   Stream = 'stream'
}

export interface IAttachment {
   type: Attachment
   name: string
}

export class AttachmentFile implements IAttachment {
   type: Attachment = Attachment.File
   name: string
   file: string

   constructor(name: string, filePath: string) {
      this.name = name
      this.file = filePath
   }
}

export class AttachmentStream implements IAttachment {
   type: Attachment = Attachment.Stream
   name: string
   stream: string

   constructor(name: string, stream: string) {
      this.name = name
      this.stream = stream
   }
}

export class GmailWriteStreamOptions {
   from: string = ''
   to: string[] = new Array<string>()
   cc: string[] = new Array<string>()
   bcc: string[] = new Array<string>()
   subject: string = ''
   body: string | StreamRef = ''
   attachments: IAttachment[] = new Array<IAttachment>()
   streamOptions: WritableOptions = {}

   constructor() {

   }

   static fromStep(info: StepInfo): GmailWriteStreamOptions {
      let options = new GmailWriteStreamOptions()

      if(info.from == null || typeof info.from !== 'string') {
         throw new Error(`Encountered a missing or incorrect 'from' option from a Gmail plugin step. Ensure it's provided and that it is a string.`)
      }

      options.from = info.from

      if(info.to == null) {
         throw new Error(`Encountered a missing 'to' option from a Gmail plugin step. Ensure it's provided and that it is a string or string array.`)
      }

      if(typeof info.to === 'string') {
         options.to = [info.to]
      } else if(Array.isArray(info.to)) {
         options.to = info.to
      } else {
         throw new Error(`Invalid 'to' option encoutnered in a gmail plugin. It's expcted to be a string or a string array`)
      }

      if(typeof info.cc === 'string') {
         options.cc = [info.cc]
      } else if(Array.isArray(info.cc)) {
         options.cc = info.cc
      } else {
         throw new Error(`Invalid 'cc' option encoutnered in a gmail plugin. It's expcted to be a string or a string array`)
      }

      if(typeof info.bcc === 'string') {
         options.bcc = [info.bcc]
      } else if(Array.isArray(info.bcc)) {
         options.bcc = info.bcc
      } else {
         throw new Error(`Invalid 'bcc' option encoutnered in a gmail plugin. It's expcted to be a string or a string array`)
      }

      if(info.subject != null) {
         if(typeof info.subject === 'string') {
            options.subject = info.subject
         } else {
            throw new Error(`Invalid 'subject' option encountered in a gmail step. It's expected to be a string`)
         }
      }

      if(info.body != null) {
         if(typeof info.body === 'string') {
            options.body = info.body
         } else if(typeof info.body === 'object' && info.body.stream != null) {
            options.body = new StreamRef(info.body.stream)
         } else {
            throw new Error(`Invalid 'body' option encountered in a gmail step. t's expected to be a string, or an object literal with a stream property.`)
         }
      }

      let isValidAttachment = (item: any) => {
         if(item.name == null) {
            return false
         }
         
         if(item.file == null && item.stream == null) {
            return false
         }

         if(item.file != null) {
            return typeof item.file === 'string'
         }

         if(item.stream != null) {
            return typeof item.stream === 'string'
         }

         return false
      }

      let isFileAttachment = (item: any) => {
         return item.file != null
      }

      let isStreamAttachment = (item: any) => {
         return item.stream != null
      }

      if(info.attachments != null) {
         if(!Array.isArray(info.attachments)) {
            info.attachments = [info.attachments]
         }

         for(let attachment of info.attachments) {
            if(!isValidAttachment(attachment)) {
               throw new Error(`Invalid 'attachments' option encountered in a gmail step.`)
            }

            if(isFileAttachment(attachment)) {
               options.attachments.push(new AttachmentFile(attachment.name, attachment.file))
            }

            if(isStreamAttachment(attachment)) {
               options.attachments.push(new AttachmentStream(attachment.name, attachment.stream))
            }
         }
      }

      if(info.streamOptions != null) {
         options.streamOptions = info.streamOptions
      }

      return options
   }

}