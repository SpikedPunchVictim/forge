"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailCreateStream = void 0;
const forge_1 = require("@spikedpunch/forge");
const readable_stream_1 = require("readable-stream");
const GoogleStreamOptions_1 = require("./GoogleStreamOptions");
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
class GmailCreateStream extends readable_stream_1.Writable {
    constructor(createOptions, auth, options) {
        super(options);
        this.options = createOptions;
        this.auth = auth;
        this.internalStreamsTrait = undefined;
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
    _write(chunk, encoding, cb) {
        // let transport = nodemailer.createTransport({
        //    service: "gmail",
        //    auth: {
        //       type: "OAuth2",
        //       user: this.options.from,
        //    }
        // })
    }
    async setTraits(traits) {
        // Build a list of inner stream channels
        let streams = this.options.attachments
            .filter(att => att.type === GoogleStreamOptions_1.Attachment.Stream)
            //@ts-ignore
            .map(att => att.stream);
        // Is the body a StreamRef?
        if (typeof this.options.body === 'object') {
            // If so, add it to the list of channels
            streams.push(this.options.body.alias);
        }
        this.internalStreamsTrait = new forge_1.InternalStreamsTrait(streams);
        traits.push(this.internalStreamsTrait);
    }
}
exports.GmailCreateStream = GmailCreateStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV3JpdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvV3JpdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQStGO0FBQy9GLHFEQUE0RDtBQUM1RCwrREFBMkU7QUFFM0Usc0NBQXNDO0FBQ3RDLDJDQUEyQztBQUczQyw2QkFBNkI7QUFDN0IsV0FBVztBQUNYLGlEQUFpRDtBQUNqRCxRQUFRO0FBQ1IsZ0RBQWdEO0FBQ2hELGlEQUFpRDtBQUNqRCwrQkFBK0I7QUFDL0Isa0RBQWtEO0FBQ2xELGdDQUFnQztBQUNoQyxnQ0FBZ0M7QUFDaEMsYUFBYTtBQUNiLDhEQUE4RDtBQUM5RCxRQUFRO0FBQ1IsOENBQThDO0FBQzlDLG9CQUFvQjtBQUNwQix1REFBdUQ7QUFDdkQsbUVBQW1FO0FBQ25FLE9BQU87QUFHUCxNQUFhLGlCQUNWLFNBQVEsMEJBQVE7SUFRaEIsWUFBWSxhQUFzQyxFQUFFLElBQXFDLEVBQUUsT0FBeUI7UUFDakgsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ2QsSUFBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUE7UUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQTtJQUN4QyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BNENFO0lBQ0YsTUFBTSxDQUFDLEtBQVUsRUFBRSxRQUFnQixFQUFFLEVBQWtDO1FBQ3BFLCtDQUErQztRQUMvQyx1QkFBdUI7UUFDdkIsYUFBYTtRQUNiLHdCQUF3QjtRQUN4QixpQ0FBaUM7UUFFakMsT0FBTztRQUNQLEtBQUs7SUFDUixDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFzQjtRQUNuQyx3Q0FBd0M7UUFDeEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssZ0NBQVUsQ0FBQyxNQUFNLENBQUM7WUFDOUMsWUFBWTthQUNYLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQWEsQ0FBQTtRQUd0QywyQkFBMkI7UUFDM0IsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUN4Qyx3Q0FBd0M7WUFDeEMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUN2QztRQUVELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLDRCQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzdELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7SUFDekMsQ0FBQztDQUNIO0FBekZELDhDQXlGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEludGVybmFsU3RyZWFtc1RyYWl0LCBJU3RyZWFtVHJhaXRDb250YWluZXIsIElTdHJlYW1UcmFpdCB9IGZyb20gXCJAc3Bpa2VkcHVuY2gvZm9yZ2VcIjtcbmltcG9ydCB7IFdyaXRhYmxlLCBXcml0YWJsZU9wdGlvbnMgfSBmcm9tIFwicmVhZGFibGUtc3RyZWFtXCI7XG5pbXBvcnQgeyBBdHRhY2htZW50LCBHbWFpbFdyaXRlU3RyZWFtT3B0aW9ucyB9IGZyb20gXCIuL0dvb2dsZVN0cmVhbU9wdGlvbnNcIlxuaW1wb3J0IHsgR29vZ2xlQXV0aCwgSldULCBPQXV0aDJDbGllbnQgfSBmcm9tICdnb29nbGUtYXV0aC1saWJyYXJ5J1xuLy8gaW1wb3J0IHsgZ29vZ2xlIH0gZnJvbSAnZ29vZ2xlYXBpcydcbi8vIGltcG9ydCAqIGFzIG5vZGVtYWlsZXIgZnJvbSAnbm9kZW1haWxlcidcblxuXG4vLyAgICBmcm9tOiAnZnJvbUBlbWFpbC5jb20nLFxuLy8gICAgdG86IFtcbi8vICAgICAgICdwZXJzb24xQGVtYWlsLmNvbScsICdwZXJzb24yQGVtYWlsLmNvbSdcbi8vICAgIF0sXG4vLyAgICBjYzogW10sICAvLyBBcnJheSB8IHN0cmluZyBvZiBlbWFpbHMgdG8gQ0Ncbi8vICAgIGJjYzogW10sIC8vIEFycmF5IHwgc3RyaW5nIG9mIGVtYWlscyB0byBiY2Ncbi8vICAgIHN1YmplY3Q6ICdFbWFpbCBzdWJqZWN0Jyxcbi8vICAgIC8vIENhbiBwcm92aWRlIHRoZSBib2R5IGRpcmVjdGx5IGFzIGEgc3RyaW5nXG4vLyAgICBib2R5OiBgSSdtIGEgc3RyaW5nIGJvZHlgLFxuLy8gICAgLy8gT3IgY2FuIHByb3ZpZGUgYSBzdHJlYW1cbi8vICAgIGJvZHk6IHtcbi8vICAgICAgIHN0cmVhbTogJ3N0cmVhbS1hbGlhcycgIC8vIFRoaXMgZXhwZWN0cyBhIHRleHQgc3RyZWFtXG4vLyAgICB9LFxuLy8gICAgLy8gQXR0YWNobWVudHMgY2FuIHRha2UgZmlsZXMgb3Igc3RyZWFtc1xuLy8gICAgYXR0YWNobWVudHM6IFtcbi8vICAgICAgIHsgbmFtZTogJ2ZpbGUuanNvbicsIHN0cmVhbTogJ3N0cmVhbS1hbGlhcycgfSxcbi8vICAgICAgIHsgbmFtZTogJ2ZpbGUyLmpzb24nLCBmaWxlOiAncmVsYXRpdmUvcGF0aC90by9maWxlLmpzb24nIH1cbi8vICAgIF1cblxuXG5leHBvcnQgY2xhc3MgR21haWxDcmVhdGVTdHJlYW1cbiAgIGV4dGVuZHMgV3JpdGFibGVcbiAgIGltcGxlbWVudHMgSVN0cmVhbVRyYWl0Q29udGFpbmVyIHtcblxuICAgcmVhZG9ubHkgb3B0aW9uczogR21haWxXcml0ZVN0cmVhbU9wdGlvbnNcbiAgIHJlYWRvbmx5IGF1dGg6IEpXVCB8IEdvb2dsZUF1dGggfCBPQXV0aDJDbGllbnRcblxuICAgcHJpdmF0ZSBpbnRlcm5hbFN0cmVhbXNUcmFpdDogSW50ZXJuYWxTdHJlYW1zVHJhaXQgfCB1bmRlZmluZWRcblxuICAgY29uc3RydWN0b3IoY3JlYXRlT3B0aW9uczogR21haWxXcml0ZVN0cmVhbU9wdGlvbnMsIGF1dGg6IEdvb2dsZUF1dGggfCBKV1QgfCBPQXV0aDJDbGllbnQsIG9wdGlvbnM/OiBXcml0YWJsZU9wdGlvbnMpIHtcbiAgICAgIHN1cGVyKG9wdGlvbnMpXG4gICAgICB0aGlzLm9wdGlvbnMgPSBjcmVhdGVPcHRpb25zXG4gICAgICB0aGlzLmF1dGggPSBhdXRoXG4gICAgICB0aGlzLmludGVybmFsU3RyZWFtc1RyYWl0ID0gdW5kZWZpbmVkXG4gICB9XG5cbiAgIC8qXG4gIGFzeW5jIHNlbmRFbWFpbCh0bywgc3ViamVjdCwgYm9keSwgZmlsZXMpIHtcbiAgICAvLyAxMDAgcXVvdGEgdW5pdHNcbiAgICBjb25zdCBtYWlsID0ge1xuICAgICAgdG86IHRvLFxuICAgICAgdGV4dDogYm9keSxcbiAgICAgIHN1YmplY3QsXG4gICAgICB0ZXh0RW5jb2Rpbmc6ICdiYXNlNjQnLFxuICAgIH07XG4gICAgY29uc3QgYXR0YWNobWVudHMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGUpKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBCYXNlNjRFbmNvZGUoYXdhaXQgZnMucmVhZEZpbGUoZmlsZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pKTtcbiAgICAgICAgYXR0YWNobWVudHMucHVzaCh7XG4gICAgICAgICAgZmlsZW5hbWU6IHBhdGguYmFzZW5hbWUoZmlsZSksXG4gICAgICAgICAgY29udGVudDogY29udGVudCxcbiAgICAgICAgICBlbmNvZGluZzogJ2Jhc2U2NCcsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBtYWlsLmF0dGFjaG1lbnRzID0gYXR0YWNobWVudHM7XG4gICAgY29uc3Qgc2VuZCA9IG5ldyBNYWlsQ29tcG9zZXIoeyAuLi5tYWlsIH0pO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzZW5kLmNvbXBpbGUoKS5idWlsZChhc3luYyAoZXJyLCBtc2cpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByYXcgPSAobXNnKS50b1N0cmluZygnYmFzZTY0JykucmVwbGFjZSgvXFwrL2csICctJylcbiAgICAgICAgICAucmVwbGFjZSgvXFwvL2csICdfJylcbiAgICAgICAgICAucmVwbGFjZSgvPSskLywgJycpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJhdGVsaW1pdGVyLmFzeW5jKFxuICAgICAgICAgIDEwMCxcbiAgICAgICAgICAoKSA9PiB0aGlzLmdtYWlsLnVzZXJzLm1lc3NhZ2VzLnNlbmQoe1xuICAgICAgICAgICAgdXNlcklkOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgIHJlc291cmNlOiB7XG4gICAgICAgICAgICAgIHJhdyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSkpXG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cblxuICAgKi9cbiAgIF93cml0ZShjaHVuazogYW55LCBlbmNvZGluZzogc3RyaW5nLCBjYjogKGVycm9yPzogRXJyb3IgfCBudWxsKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAvLyBsZXQgdHJhbnNwb3J0ID0gbm9kZW1haWxlci5jcmVhdGVUcmFuc3BvcnQoe1xuICAgICAgLy8gICAgc2VydmljZTogXCJnbWFpbFwiLFxuICAgICAgLy8gICAgYXV0aDoge1xuICAgICAgLy8gICAgICAgdHlwZTogXCJPQXV0aDJcIixcbiAgICAgIC8vICAgICAgIHVzZXI6IHRoaXMub3B0aW9ucy5mcm9tLFxuXG4gICAgICAvLyAgICB9XG4gICAgICAvLyB9KVxuICAgfVxuXG4gICBhc3luYyBzZXRUcmFpdHModHJhaXRzOiBJU3RyZWFtVHJhaXRbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgLy8gQnVpbGQgYSBsaXN0IG9mIGlubmVyIHN0cmVhbSBjaGFubmVsc1xuICAgICAgbGV0IHN0cmVhbXMgPSB0aGlzLm9wdGlvbnMuYXR0YWNobWVudHNcbiAgICAgICAgIC5maWx0ZXIoYXR0ID0+IGF0dC50eXBlID09PSBBdHRhY2htZW50LlN0cmVhbSlcbiAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgLm1hcChhdHQgPT4gYXR0LnN0cmVhbSkgYXMgc3RyaW5nW11cblxuXG4gICAgICAvLyBJcyB0aGUgYm9keSBhIFN0cmVhbVJlZj9cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmJvZHkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAvLyBJZiBzbywgYWRkIGl0IHRvIHRoZSBsaXN0IG9mIGNoYW5uZWxzXG4gICAgICAgICBzdHJlYW1zLnB1c2godGhpcy5vcHRpb25zLmJvZHkuYWxpYXMpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW50ZXJuYWxTdHJlYW1zVHJhaXQgPSBuZXcgSW50ZXJuYWxTdHJlYW1zVHJhaXQoc3RyZWFtcylcbiAgICAgIHRyYWl0cy5wdXNoKHRoaXMuaW50ZXJuYWxTdHJlYW1zVHJhaXQpXG4gICB9XG59Il19