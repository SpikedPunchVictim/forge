import { InternalStreamsTrait, IStreamTraitContainer, IStreamTrait } from "@spikedpunch/forge";
import { Writable, WritableOptions } from "readable-stream";
import { Attachment, GmailWriteStreamOptions } from "./GoogleStreamOptions"
import { GoogleAuth, JWT, OAuth2Client } from 'google-auth-library'
// import { google } from 'googleapis'
// import * as nodemailer from 'nodemailer'


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


export class GmailCreateStream
   extends Writable
   implements IStreamTraitContainer {

   readonly options: GmailWriteStreamOptions
   readonly auth: JWT | GoogleAuth | OAuth2Client

   private internalStreamsTrait: InternalStreamsTrait | undefined

   constructor(createOptions: GmailWriteStreamOptions, auth: GoogleAuth | JWT | OAuth2Client, options?: WritableOptions) {
      super(options)
      this.options = createOptions
      this.auth = auth
      this.internalStreamsTrait = undefined
   }

   /*
  async sendEmail(to, subject, body, files) {
    // 100 quota units
    const mail = {
      to: to,
      text: body,
      subject,
      textEncoding: 'base64',
    };
    const attachments = [];
    for (const file of files) {
      if (fs.existsSync(file)) {
        const content = Base64Encode(await fs.readFile(file, { encoding: 'utf8' }));
        attachments.push({
          filename: path.basename(file),
          content: content,
          encoding: 'base64',
        });
      }
    }
    mail.attachments = attachments;
    const send = new MailComposer({ ...mail });
    return new Promise((resolve, reject) => {
      send.compile().build(async (err, msg) => {
        if (err) {
          return reject(err);
        }
        const raw = (msg).toString('base64').replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
        const result = await this.ratelimiter.async(
          100,
          () => this.gmail.users.messages.send({
            userId: this.userId,
            resource: {
              raw,
            },
          }))
        resolve(result);
      });
    });
  }


   */
   _write(chunk: any, encoding: string, cb: (error?: Error | null) => void): void {
      // let transport = nodemailer.createTransport({
      //    service: "gmail",
      //    auth: {
      //       type: "OAuth2",
      //       user: this.options.from,

      //    }
      // })
   }

   async setTraits(traits: IStreamTrait[]): Promise<void> {
      // Build a list of inner stream channels
      let streams = this.options.attachments
         .filter(att => att.type === Attachment.Stream)
         //@ts-ignore
         .map(att => att.stream) as string[]


      // Is the body a StreamRef?
      if (typeof this.options.body === 'object') {
         // If so, add it to the list of channels
         streams.push(this.options.body.alias)
      }

      this.internalStreamsTrait = new InternalStreamsTrait(streams)
      traits.push(this.internalStreamsTrait)
   }
}