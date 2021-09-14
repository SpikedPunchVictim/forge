import { Readable, ReadableOptions } from "readable-stream";
import { GmailReadStreamOptions } from "./GoogleStreamOptions";
import { google, gmail_v1 } from 'googleapis'
import { GoogleAuth, JWT, OAuth2Client } from 'google-auth-library'

export type Attachment = {
   filename: string
   mimeType: string
   attachment: any
}

export type GmailObject = {
   email: any
   attachments: Attachment[]
}

export class GmailReadableStream extends Readable {
   readonly options: GmailReadStreamOptions
   readonly userId: string // Impersonation email
   readonly auth: GoogleAuth | JWT | OAuth2Client | string

   private gmail: gmail_v1.Gmail
   private pageToken: string | null | undefined = undefined
   private messageIds: string[]
   private finished: boolean

   constructor(
      readOptions: GmailReadStreamOptions,
      authClient: GoogleAuth | JWT | OAuth2Client,
      userId: string,
      options?: ReadableOptions
   ) {
      super({
         ...options,
         objectMode: true
      })

      this.options = readOptions
      this.auth = authClient
      this.userId = userId
      this.messageIds = new Array<string>()
      this.finished = false

      this.gmail = google.gmail({
         version: 'v1',
         auth: authClient
      })
   }

   async _read(): Promise<void> {
      try {
         let rateLimiter = this.options.rateLimiter

         let id = this.messageIds.shift()

         if (id === undefined) {
            this.messageIds = await this.getNextMessageIds()
            id = this.messageIds.shift()

            if (id === undefined) {
               this.push(null)
               return
            }
         }
         
         let message = await rateLimiter.async(
            5,
            //@ts-ignore
            () => this.gmail.users.messages.get({
               userId: this.userId,
               id
            })
         )

         let data = message.data
         let attachments = new Array<Attachment>()

         // Pull attachments if needed
         if (this.options.includeAttachments) {
            for (let part of data.payload?.parts || []) {
               let attachmentId = part.body?.attachmentId

               if (part.filename == null || part.filename === '') {
                  continue
               }

               if (attachmentId === null || attachmentId === undefined) {
                  continue
               }

               let attachment = await rateLimiter.async(
                  5,
                  () => {
                     return this.gmail.users.messages.attachments.get({
                        //@ts-ignore
                        userId: this.userId,
                        messageId: data.id,
                        id: attachmentId
                     })
                  }
               )

               attachments.push({
                  filename: part.filename,
                  mimeType: part.mimeType || '',
                  attachment: attachment.data
               })
            }
         }

         this.push({
            email: message.data,
            attachments
         })
      } catch (err) {
         console.log(err)
         this.destroy(err)
      }
   }

   private async getNextMessageIds(): Promise<string[]> {
      let ids = new Array<string>()

      if(this.finished) {
         return ids
      }

      try {
         let rateLimiter = this.options.rateLimiter

         // Retrieve a list of message IDs first
         const res = await rateLimiter.async(
            5,
            () => this.gmail.users.messages.list({
               pageToken: this.pageToken == null ? undefined : this.pageToken,
               includeSpamTrash: this.options.includeSpamTrash,
               labelIds: this.options.labels,
               q: this.options.query,
               maxResults: this.options.maxResults,
               userId: this.userId
            })
         )

         this.pageToken = res.data.nextPageToken

         if (res.data.messages == null) {
            this.finished = true
            return ids
         }

         if(this.pageToken == null && res.data.messages.length <= this.options.maxResults) {
            this.finished = true
         }

         //@ts-ignore
         ids = res.data.messages
            .filter(it => it.id != null)
            .map(it => it.id)

      } catch (err) {
         this.destroy(err)
      }

      return ids
   }
}