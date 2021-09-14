"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailWriteStreamOptions = exports.AttachmentStream = exports.AttachmentFile = exports.Attachment = exports.StreamRef = exports.GmailReadStreamOptions = void 0;
const RateLimiter_1 = require("./RateLimiter");
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
class GmailReadStreamOptions {
    constructor() {
        this.labels = new Array();
        this.includeSpamTrash = false;
        this.includeAttachments = false;
        this.maxResults = 50;
        this.query = '';
        this.userId = undefined;
        this.streamOptions = {};
        // Reference: https://developers.google.com/gmail/api/reference/quota
        this.rateLimiter = new RateLimiter_1.GoogleRateLimiter(250, 1000000000);
    }
    static fromStep(info, pluginOptions) {
        let options = new GmailReadStreamOptions();
        if (info.labels != null) {
            if (typeof info.labels === 'string') {
                options.labels.push(info.labels);
            }
            else if (Array.isArray(info.labels)) {
                options.labels.push(...info.labels);
            }
            else {
                throw new Error(`The 'labels' option in a Gmail step is expected to be a tring or an Array<string>. Received ${typeof info.labels} instead.`);
            }
        }
        if (info.includeSpamTrash != null) {
            options.includeSpamTrash = info.includeSpamTrash == true;
        }
        if (info.includeAttachments != null) {
            options.includeAttachments = info.includeAttachments;
        }
        if (info.maxResults != null) {
            if (typeof info.maxResults !== 'number') {
                throw new Error(`The 'maxResults' option in a Gmail plugin is expected to be a number. Received ${typeof info.maxResults} instead.`);
            }
            options.maxResults = info.maxResults == 0 ? 50 : info.maxResults;
        }
        if (info.userId != null) {
            if (typeof info.maxResults !== 'string') {
                throw new Error(`The 'userId' option in a Gmail plugin is expected to be a string. Received ${typeof info.userId} instead.`);
            }
            options.userId = info.userId;
        }
        else {
            options.userId = pluginOptions.email;
        }
        options.query = info.query || options.query;
        options.rateLimiter = info.rateLimiter || options.rateLimiter;
        if (info.streamOptions != null) {
            options.streamOptions = info.streamOptions;
        }
        return options;
    }
}
exports.GmailReadStreamOptions = GmailReadStreamOptions;
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
class StreamRef {
    constructor(alias) {
        this.alias = alias;
    }
}
exports.StreamRef = StreamRef;
var Attachment;
(function (Attachment) {
    Attachment["File"] = "file";
    Attachment["Stream"] = "stream";
})(Attachment = exports.Attachment || (exports.Attachment = {}));
class AttachmentFile {
    constructor(name, filePath) {
        this.type = Attachment.File;
        this.name = name;
        this.file = filePath;
    }
}
exports.AttachmentFile = AttachmentFile;
class AttachmentStream {
    constructor(name, stream) {
        this.type = Attachment.Stream;
        this.name = name;
        this.stream = stream;
    }
}
exports.AttachmentStream = AttachmentStream;
class GmailWriteStreamOptions {
    constructor() {
        this.from = '';
        this.to = new Array();
        this.cc = new Array();
        this.bcc = new Array();
        this.subject = '';
        this.body = '';
        this.attachments = new Array();
        this.streamOptions = {};
    }
    static fromStep(info) {
        let options = new GmailWriteStreamOptions();
        if (info.from == null || typeof info.from !== 'string') {
            throw new Error(`Encountered a missing or incorrect 'from' option from a Gmail plugin step. Ensure it's provided and that it is a string.`);
        }
        options.from = info.from;
        if (info.to == null) {
            throw new Error(`Encountered a missing 'to' option from a Gmail plugin step. Ensure it's provided and that it is a string or string array.`);
        }
        if (typeof info.to === 'string') {
            options.to = [info.to];
        }
        else if (Array.isArray(info.to)) {
            options.to = info.to;
        }
        else {
            throw new Error(`Invalid 'to' option encoutnered in a gmail plugin. It's expcted to be a string or a string array`);
        }
        if (typeof info.cc === 'string') {
            options.cc = [info.cc];
        }
        else if (Array.isArray(info.cc)) {
            options.cc = info.cc;
        }
        else {
            throw new Error(`Invalid 'cc' option encoutnered in a gmail plugin. It's expcted to be a string or a string array`);
        }
        if (typeof info.bcc === 'string') {
            options.bcc = [info.bcc];
        }
        else if (Array.isArray(info.bcc)) {
            options.bcc = info.bcc;
        }
        else {
            throw new Error(`Invalid 'bcc' option encoutnered in a gmail plugin. It's expcted to be a string or a string array`);
        }
        if (info.subject != null) {
            if (typeof info.subject === 'string') {
                options.subject = info.subject;
            }
            else {
                throw new Error(`Invalid 'subject' option encountered in a gmail step. It's expected to be a string`);
            }
        }
        if (info.body != null) {
            if (typeof info.body === 'string') {
                options.body = info.body;
            }
            else if (typeof info.body === 'object' && info.body.stream != null) {
                options.body = new StreamRef(info.body.stream);
            }
            else {
                throw new Error(`Invalid 'body' option encountered in a gmail step. t's expected to be a string, or an object literal with a stream property.`);
            }
        }
        let isValidAttachment = (item) => {
            if (item.name == null) {
                return false;
            }
            if (item.file == null && item.stream == null) {
                return false;
            }
            if (item.file != null) {
                return typeof item.file === 'string';
            }
            if (item.stream != null) {
                return typeof item.stream === 'string';
            }
            return false;
        };
        let isFileAttachment = (item) => {
            return item.file != null;
        };
        let isStreamAttachment = (item) => {
            return item.stream != null;
        };
        if (info.attachments != null) {
            if (!Array.isArray(info.attachments)) {
                info.attachments = [info.attachments];
            }
            for (let attachment of info.attachments) {
                if (!isValidAttachment(attachment)) {
                    throw new Error(`Invalid 'attachments' option encountered in a gmail step.`);
                }
                if (isFileAttachment(attachment)) {
                    options.attachments.push(new AttachmentFile(attachment.name, attachment.file));
                }
                if (isStreamAttachment(attachment)) {
                    options.attachments.push(new AttachmentStream(attachment.name, attachment.stream));
                }
            }
        }
        if (info.streamOptions != null) {
            options.streamOptions = info.streamOptions;
        }
        return options;
    }
}
exports.GmailWriteStreamOptions = GmailWriteStreamOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR29vZ2xlU3RyZWFtT3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Hb29nbGVTdHJlYW1PcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUFxRTtBQUtyRTs7Ozs7Ozs7Ozs7Ozs7Ozs7NkNBaUI2QztBQUU3QyxHQUFHO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSiwyQkFBMkI7QUFDM0IsMEJBQTBCO0FBQzFCLHFCQUFxQjtBQUNyQiw2QkFBNkI7QUFDN0IsV0FBVztBQUNYLGlEQUFpRDtBQUNqRCxRQUFRO0FBQ1IsZ0RBQWdEO0FBQ2hELGlEQUFpRDtBQUNqRCwrQkFBK0I7QUFDL0Isa0RBQWtEO0FBQ2xELGdDQUFnQztBQUNoQyxnQ0FBZ0M7QUFDaEMsYUFBYTtBQUNiLDhEQUE4RDtBQUM5RCxRQUFRO0FBQ1IsOENBQThDO0FBQzlDLG9CQUFvQjtBQUNwQix1REFBdUQ7QUFDdkQsbUVBQW1FO0FBQ25FLE9BQU87QUFDUCxJQUFJO0FBRVAsSUFBSTtBQUdKLE1BQWEsc0JBQXNCO0lBVWhDO1FBVEEsV0FBTSxHQUFhLElBQUksS0FBSyxFQUFVLENBQUE7UUFDdEMscUJBQWdCLEdBQVksS0FBSyxDQUFBO1FBQ2pDLHVCQUFrQixHQUFZLEtBQUssQ0FBQTtRQUNuQyxlQUFVLEdBQVcsRUFBRSxDQUFBO1FBQ3ZCLFVBQUssR0FBVyxFQUFFLENBQUE7UUFFbEIsV0FBTSxHQUF1QixTQUFTLENBQUE7UUFDdEMsa0JBQWEsR0FBb0IsRUFBRSxDQUFBO1FBR2hDLHFFQUFxRTtRQUNyRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksK0JBQWlCLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQzVELENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQWMsRUFBRSxhQUFrQztRQUMvRCxJQUFJLE9BQU8sR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUE7UUFFMUMsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtZQUNyQixJQUFHLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUU7Z0JBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUNsQztpQkFBTSxJQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUNyQztpQkFBTTtnQkFDSixNQUFNLElBQUksS0FBSyxDQUFDLCtGQUErRixPQUFPLElBQUksQ0FBQyxNQUFNLFdBQVcsQ0FBQyxDQUFBO2FBQy9JO1NBQ0g7UUFFRCxJQUFHLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLEVBQUU7WUFDL0IsT0FBTyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUE7U0FDMUQ7UUFFRCxJQUFHLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLEVBQUU7WUFDakMsT0FBTyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQTtTQUN0RDtRQUVELElBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7WUFDekIsSUFBRyxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssUUFBUSxFQUFFO2dCQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLGtGQUFrRixPQUFPLElBQUksQ0FBQyxVQUFVLFdBQVcsQ0FBQyxDQUFBO2FBQ3RJO1lBRUQsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFBO1NBQ2xFO1FBRUQsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtZQUNyQixJQUFHLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxRQUFRLEVBQUU7Z0JBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsOEVBQThFLE9BQU8sSUFBSSxDQUFDLE1BQU0sV0FBVyxDQUFDLENBQUE7YUFDOUg7WUFFRCxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7U0FDOUI7YUFBTTtZQUNKLE9BQU8sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQTtTQUN0QztRQUVELE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFBO1FBQzNDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFBO1FBRTdELElBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLEVBQUU7WUFDNUIsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFBO1NBQzVDO1FBRUQsT0FBTyxPQUFPLENBQUE7SUFDakIsQ0FBQztDQUNIO0FBL0RELHdEQStEQztBQUdFLDZCQUE2QjtBQUM3QixXQUFXO0FBQ1gsaURBQWlEO0FBQ2pELFFBQVE7QUFDUixnREFBZ0Q7QUFDaEQsaURBQWlEO0FBQ2pELCtCQUErQjtBQUMvQixrREFBa0Q7QUFDbEQsZ0NBQWdDO0FBQ2hDLGdDQUFnQztBQUNoQyxhQUFhO0FBQ2IsOERBQThEO0FBQzlELFFBQVE7QUFDUiw4Q0FBOEM7QUFDOUMsb0JBQW9CO0FBQ3BCLHVEQUF1RDtBQUN2RCxtRUFBbUU7QUFDbkUsT0FBTztBQUdWLE1BQWEsU0FBUztJQUduQixZQUFZLEtBQWE7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7SUFDckIsQ0FBQztDQUNIO0FBTkQsOEJBTUM7QUFFRCxJQUFZLFVBR1g7QUFIRCxXQUFZLFVBQVU7SUFDbkIsMkJBQWEsQ0FBQTtJQUNiLCtCQUFpQixDQUFBO0FBQ3BCLENBQUMsRUFIVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQUdyQjtBQU9ELE1BQWEsY0FBYztJQUt4QixZQUFZLElBQVksRUFBRSxRQUFnQjtRQUoxQyxTQUFJLEdBQWUsVUFBVSxDQUFDLElBQUksQ0FBQTtRQUsvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQTtJQUN2QixDQUFDO0NBQ0g7QUFURCx3Q0FTQztBQUVELE1BQWEsZ0JBQWdCO0lBSzFCLFlBQVksSUFBWSxFQUFFLE1BQWM7UUFKeEMsU0FBSSxHQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUE7UUFLakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7SUFDdkIsQ0FBQztDQUNIO0FBVEQsNENBU0M7QUFFRCxNQUFhLHVCQUF1QjtJQVVqQztRQVRBLFNBQUksR0FBVyxFQUFFLENBQUE7UUFDakIsT0FBRSxHQUFhLElBQUksS0FBSyxFQUFVLENBQUE7UUFDbEMsT0FBRSxHQUFhLElBQUksS0FBSyxFQUFVLENBQUE7UUFDbEMsUUFBRyxHQUFhLElBQUksS0FBSyxFQUFVLENBQUE7UUFDbkMsWUFBTyxHQUFXLEVBQUUsQ0FBQTtRQUNwQixTQUFJLEdBQXVCLEVBQUUsQ0FBQTtRQUM3QixnQkFBVyxHQUFrQixJQUFJLEtBQUssRUFBZSxDQUFBO1FBQ3JELGtCQUFhLEdBQW9CLEVBQUUsQ0FBQTtJQUluQyxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFjO1FBQzNCLElBQUksT0FBTyxHQUFHLElBQUksdUJBQXVCLEVBQUUsQ0FBQTtRQUUzQyxJQUFHLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDcEQsTUFBTSxJQUFJLEtBQUssQ0FBQywwSEFBMEgsQ0FBQyxDQUFBO1NBQzdJO1FBRUQsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO1FBRXhCLElBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQywySEFBMkgsQ0FBQyxDQUFBO1NBQzlJO1FBRUQsSUFBRyxPQUFPLElBQUksQ0FBQyxFQUFFLEtBQUssUUFBUSxFQUFFO1lBQzdCLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDeEI7YUFBTSxJQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQTtTQUN0QjthQUFNO1lBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxrR0FBa0csQ0FBQyxDQUFBO1NBQ3JIO1FBRUQsSUFBRyxPQUFPLElBQUksQ0FBQyxFQUFFLEtBQUssUUFBUSxFQUFFO1lBQzdCLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDeEI7YUFBTSxJQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQTtTQUN0QjthQUFNO1lBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxrR0FBa0csQ0FBQyxDQUFBO1NBQ3JIO1FBRUQsSUFBRyxPQUFPLElBQUksQ0FBQyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQzlCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDMUI7YUFBTSxJQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtTQUN4QjthQUFNO1lBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxtR0FBbUcsQ0FBQyxDQUFBO1NBQ3RIO1FBRUQsSUFBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRTtZQUN0QixJQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7Z0JBQ2xDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQTthQUNoQztpQkFBTTtnQkFDSixNQUFNLElBQUksS0FBSyxDQUFDLG9GQUFvRixDQUFDLENBQUE7YUFDdkc7U0FDSDtRQUVELElBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDbkIsSUFBRyxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUMvQixPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7YUFDMUI7aUJBQU0sSUFBRyxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtnQkFDbEUsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ2hEO2lCQUFNO2dCQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsOEhBQThILENBQUMsQ0FBQTthQUNqSjtTQUNIO1FBRUQsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFO1lBQ25DLElBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7Z0JBQ25CLE9BQU8sS0FBSyxDQUFBO2FBQ2Q7WUFFRCxJQUFHLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFO2dCQUMxQyxPQUFPLEtBQUssQ0FBQTthQUNkO1lBRUQsSUFBRyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtnQkFDbkIsT0FBTyxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFBO2FBQ3RDO1lBRUQsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtnQkFDckIsT0FBTyxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFBO2FBQ3hDO1lBRUQsT0FBTyxLQUFLLENBQUE7UUFDZixDQUFDLENBQUE7UUFFRCxJQUFJLGdCQUFnQixHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDbEMsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQTtRQUMzQixDQUFDLENBQUE7UUFFRCxJQUFJLGtCQUFrQixHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDcEMsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQTtRQUM3QixDQUFDLENBQUE7UUFFRCxJQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO1lBQzFCLElBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTthQUN2QztZQUVELEtBQUksSUFBSSxVQUFVLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDckMsSUFBRyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLDJEQUEyRCxDQUFDLENBQUE7aUJBQzlFO2dCQUVELElBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQzlCLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7aUJBQ2hGO2dCQUVELElBQUcsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ2hDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtpQkFDcEY7YUFDSDtTQUNIO1FBRUQsSUFBRyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksRUFBRTtZQUM1QixPQUFPLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUE7U0FDNUM7UUFFRCxPQUFPLE9BQU8sQ0FBQTtJQUNqQixDQUFDO0NBRUg7QUE1SEQsMERBNEhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR29vZ2xlUmF0ZUxpbWl0ZXIsIElHb29nbGVSYXRlTGltaXRlciB9IGZyb20gXCIuL1JhdGVMaW1pdGVyXCJcbmltcG9ydCB7IFN0ZXBJbmZvIH0gZnJvbSAnQHNwaWtlZHB1bmNoL2ZvcmdlJ1xuaW1wb3J0IHsgR29vZ2xlUGx1Z2luT3B0aW9ucyB9IGZyb20gXCIuL1BsdWdpblwiXG5pbXBvcnQgeyBSZWFkYWJsZU9wdGlvbnMsIFdyaXRhYmxlT3B0aW9ucyB9IGZyb20gXCJyZWFkYWJsZS1zdHJlYW1cIjtcblxuLypcblxuICAge1xuICAgICAgLy8gRm9yIHJldHJpZXZpbmcgZW1haWxzXG4gICAgICBhbGlhczogJ2dtYWlsLWdldCcsXG4gICAgICBwbHVnaW46ICdnbWFpbCcsXG4gICAgICAvLyAoT3B0aW9uYWwpIFByb3ZpZGUgYSBsaXN0IG9mIGxhYmVscyB0byBmaWx0ZXIgb25cbiAgICAgIGxhYmVsczogW1xuICAgICAgICAgJ2xhYmVsMScsICdsYWJlbDInXG4gICAgICBdLFxuICAgICAgLy8gKE9wdGlvbmFsKSBQcm92aWRlIGEgYm9vbGVhbiB0aGF0IGRldGVybWluZXMgaWYgU3BhbSBhbmQgVHJhc2ggZW1haWxzIGFyZSBpbmNsdWRlZFxuICAgICAgaW5jbHVkZVNwYW1UcmFzaDogdHJ1ZSxcbiAgICAgIC8vIChPcHRpb25hbCkgT25seSByZXR1cm4gYSBwYXJ0aWN1bGFyIGFtb3VudCBvZiBlbWFpbHNcbiAgICAgIG1heFJlc3VsdHM6IDAsXG4gICAgICAvLyAoT3B0aW9uYWwpIEZpbHRlciB0aGUgcmVzdWx0cyBieSB1c2luZyBhIHF1ZXJ5IChodHRwczovL3N1cHBvcnQuZ29vZ2xlLmNvbS9tYWlsL2Fuc3dlci83MTkwP2hsPWVuKVxuICAgICAgcXVlcnk6ICdhZnRlcjoyMDA0LzA0LzE2JyxcbiAgICAgIC8vIChPcHRpb25hbCkgUHJvdmlkZSBhIHJhdGUgbGltaXRlclxuICAgICAgcmF0ZUxpbWl0ZXI6IG5ldyBHb29nbGVSYXRlTGltaXRlcigvKiovXG5cbi8vKVxuICAgLy8gfSxcbiAgIC8vIHtcbiAgIC8vICAgIC8vIEZvciBTZW5kaW5nIGVtYWlsc1xuICAgLy8gICAgYWxpYXM6ICdnbWFpbC1zZW5kJyxcbiAgIC8vICAgIHBsdWdpbjogJ2dtYWlsJ1xuICAgLy8gICAgZnJvbTogJ2Zyb21AZW1haWwuY29tJyxcbiAgIC8vICAgIHRvOiBbXG4gICAvLyAgICAgICAncGVyc29uMUBlbWFpbC5jb20nLCAncGVyc29uMkBlbWFpbC5jb20nXG4gICAvLyAgICBdLFxuICAgLy8gICAgY2M6IFtdLCAgLy8gQXJyYXkgfCBzdHJpbmcgb2YgZW1haWxzIHRvIENDXG4gICAvLyAgICBiY2M6IFtdLCAvLyBBcnJheSB8IHN0cmluZyBvZiBlbWFpbHMgdG8gYmNjXG4gICAvLyAgICBzdWJqZWN0OiAnRW1haWwgc3ViamVjdCcsXG4gICAvLyAgICAvLyBDYW4gcHJvdmlkZSB0aGUgYm9keSBkaXJlY3RseSBhcyBhIHN0cmluZ1xuICAgLy8gICAgYm9keTogYEknbSBhIHN0cmluZyBib2R5YCxcbiAgIC8vICAgIC8vIE9yIGNhbiBwcm92aWRlIGEgc3RyZWFtXG4gICAvLyAgICBib2R5OiB7XG4gICAvLyAgICAgICBzdHJlYW06ICdzdHJlYW0tYWxpYXMnICAvLyBUaGlzIGV4cGVjdHMgYSB0ZXh0IHN0cmVhbVxuICAgLy8gICAgfSxcbiAgIC8vICAgIC8vIEF0dGFjaG1lbnRzIGNhbiB0YWtlIGZpbGVzIG9yIHN0cmVhbXNcbiAgIC8vICAgIGF0dGFjaG1lbnRzOiBbXG4gICAvLyAgICAgICB7IG5hbWU6ICdmaWxlLmpzb24nLCBzdHJlYW06ICdzdHJlYW0tYWxpYXMnIH0sXG4gICAvLyAgICAgICB7IG5hbWU6ICdmaWxlMi5qc29uJywgZmlsZTogJ3JlbGF0aXZlL3BhdGgvdG8vZmlsZS5qc29uJyB9XG4gICAvLyAgICBdXG4gICAvLyB9XG5cbi8vKi9cblxuXG5leHBvcnQgY2xhc3MgR21haWxSZWFkU3RyZWFtT3B0aW9ucyB7XG4gICBsYWJlbHM6IHN0cmluZ1tdID0gbmV3IEFycmF5PHN0cmluZz4oKVxuICAgaW5jbHVkZVNwYW1UcmFzaDogYm9vbGVhbiA9IGZhbHNlXG4gICBpbmNsdWRlQXR0YWNobWVudHM6IGJvb2xlYW4gPSBmYWxzZVxuICAgbWF4UmVzdWx0czogbnVtYmVyID0gNTBcbiAgIHF1ZXJ5OiBzdHJpbmcgPSAnJ1xuICAgcmF0ZUxpbWl0ZXI6IElHb29nbGVSYXRlTGltaXRlclxuICAgdXNlcklkOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgIHN0cmVhbU9wdGlvbnM6IFJlYWRhYmxlT3B0aW9ucyA9IHt9XG5cbiAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgLy8gUmVmZXJlbmNlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9nbWFpbC9hcGkvcmVmZXJlbmNlL3F1b3RhXG4gICAgICB0aGlzLnJhdGVMaW1pdGVyID0gbmV3IEdvb2dsZVJhdGVMaW1pdGVyKDI1MCwgMTAwMDAwMDAwMClcbiAgIH1cblxuICAgc3RhdGljIGZyb21TdGVwKGluZm86IFN0ZXBJbmZvLCBwbHVnaW5PcHRpb25zOiBHb29nbGVQbHVnaW5PcHRpb25zKTogR21haWxSZWFkU3RyZWFtT3B0aW9ucyB7XG4gICAgICBsZXQgb3B0aW9ucyA9IG5ldyBHbWFpbFJlYWRTdHJlYW1PcHRpb25zKClcblxuICAgICAgaWYoaW5mby5sYWJlbHMgIT0gbnVsbCkge1xuICAgICAgICAgaWYodHlwZW9mIGluZm8ubGFiZWxzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgb3B0aW9ucy5sYWJlbHMucHVzaChpbmZvLmxhYmVscylcbiAgICAgICAgIH0gZWxzZSBpZihBcnJheS5pc0FycmF5KGluZm8ubGFiZWxzKSkge1xuICAgICAgICAgICAgb3B0aW9ucy5sYWJlbHMucHVzaCguLi5pbmZvLmxhYmVscylcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSAnbGFiZWxzJyBvcHRpb24gaW4gYSBHbWFpbCBzdGVwIGlzIGV4cGVjdGVkIHRvIGJlIGEgdHJpbmcgb3IgYW4gQXJyYXk8c3RyaW5nPi4gUmVjZWl2ZWQgJHt0eXBlb2YgaW5mby5sYWJlbHN9IGluc3RlYWQuYClcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYoaW5mby5pbmNsdWRlU3BhbVRyYXNoICE9IG51bGwpIHtcbiAgICAgICAgIG9wdGlvbnMuaW5jbHVkZVNwYW1UcmFzaCA9IGluZm8uaW5jbHVkZVNwYW1UcmFzaCA9PSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmKGluZm8uaW5jbHVkZUF0dGFjaG1lbnRzICE9IG51bGwpIHtcbiAgICAgICAgIG9wdGlvbnMuaW5jbHVkZUF0dGFjaG1lbnRzID0gaW5mby5pbmNsdWRlQXR0YWNobWVudHNcbiAgICAgIH1cblxuICAgICAgaWYoaW5mby5tYXhSZXN1bHRzICE9IG51bGwpIHtcbiAgICAgICAgIGlmKHR5cGVvZiBpbmZvLm1heFJlc3VsdHMgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSAnbWF4UmVzdWx0cycgb3B0aW9uIGluIGEgR21haWwgcGx1Z2luIGlzIGV4cGVjdGVkIHRvIGJlIGEgbnVtYmVyLiBSZWNlaXZlZCAke3R5cGVvZiBpbmZvLm1heFJlc3VsdHN9IGluc3RlYWQuYClcbiAgICAgICAgIH1cblxuICAgICAgICAgb3B0aW9ucy5tYXhSZXN1bHRzID0gaW5mby5tYXhSZXN1bHRzID09IDAgPyA1MCA6IGluZm8ubWF4UmVzdWx0c1xuICAgICAgfVxuXG4gICAgICBpZihpbmZvLnVzZXJJZCAhPSBudWxsKSB7XG4gICAgICAgICBpZih0eXBlb2YgaW5mby5tYXhSZXN1bHRzICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgJ3VzZXJJZCcgb3B0aW9uIGluIGEgR21haWwgcGx1Z2luIGlzIGV4cGVjdGVkIHRvIGJlIGEgc3RyaW5nLiBSZWNlaXZlZCAke3R5cGVvZiBpbmZvLnVzZXJJZH0gaW5zdGVhZC5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBvcHRpb25zLnVzZXJJZCA9IGluZm8udXNlcklkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgb3B0aW9ucy51c2VySWQgPSBwbHVnaW5PcHRpb25zLmVtYWlsXG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMucXVlcnkgPSBpbmZvLnF1ZXJ5IHx8IG9wdGlvbnMucXVlcnlcbiAgICAgIG9wdGlvbnMucmF0ZUxpbWl0ZXIgPSBpbmZvLnJhdGVMaW1pdGVyIHx8IG9wdGlvbnMucmF0ZUxpbWl0ZXJcblxuICAgICAgaWYoaW5mby5zdHJlYW1PcHRpb25zICE9IG51bGwpIHtcbiAgICAgICAgIG9wdGlvbnMuc3RyZWFtT3B0aW9ucyA9IGluZm8uc3RyZWFtT3B0aW9uc1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3B0aW9uc1xuICAgfVxufVxuXG5cbiAgIC8vICAgIGZyb206ICdmcm9tQGVtYWlsLmNvbScsXG4gICAvLyAgICB0bzogW1xuICAgLy8gICAgICAgJ3BlcnNvbjFAZW1haWwuY29tJywgJ3BlcnNvbjJAZW1haWwuY29tJ1xuICAgLy8gICAgXSxcbiAgIC8vICAgIGNjOiBbXSwgIC8vIEFycmF5IHwgc3RyaW5nIG9mIGVtYWlscyB0byBDQ1xuICAgLy8gICAgYmNjOiBbXSwgLy8gQXJyYXkgfCBzdHJpbmcgb2YgZW1haWxzIHRvIGJjY1xuICAgLy8gICAgc3ViamVjdDogJ0VtYWlsIHN1YmplY3QnLFxuICAgLy8gICAgLy8gQ2FuIHByb3ZpZGUgdGhlIGJvZHkgZGlyZWN0bHkgYXMgYSBzdHJpbmdcbiAgIC8vICAgIGJvZHk6IGBJJ20gYSBzdHJpbmcgYm9keWAsXG4gICAvLyAgICAvLyBPciBjYW4gcHJvdmlkZSBhIHN0cmVhbVxuICAgLy8gICAgYm9keToge1xuICAgLy8gICAgICAgc3RyZWFtOiAnc3RyZWFtLWFsaWFzJyAgLy8gVGhpcyBleHBlY3RzIGEgdGV4dCBzdHJlYW1cbiAgIC8vICAgIH0sXG4gICAvLyAgICAvLyBBdHRhY2htZW50cyBjYW4gdGFrZSBmaWxlcyBvciBzdHJlYW1zXG4gICAvLyAgICBhdHRhY2htZW50czogW1xuICAgLy8gICAgICAgeyBuYW1lOiAnZmlsZS5qc29uJywgc3RyZWFtOiAnc3RyZWFtLWFsaWFzJyB9LFxuICAgLy8gICAgICAgeyBuYW1lOiAnZmlsZTIuanNvbicsIGZpbGU6ICdyZWxhdGl2ZS9wYXRoL3RvL2ZpbGUuanNvbicgfVxuICAgLy8gICAgXVxuXG5cbmV4cG9ydCBjbGFzcyBTdHJlYW1SZWYge1xuICAgcmVhZG9ubHkgYWxpYXM6IHN0cmluZ1xuXG4gICBjb25zdHJ1Y3RvcihhbGlhczogc3RyaW5nKSB7XG4gICAgICB0aGlzLmFsaWFzID0gYWxpYXNcbiAgIH1cbn1cblxuZXhwb3J0IGVudW0gQXR0YWNobWVudCB7XG4gICBGaWxlID0gJ2ZpbGUnLFxuICAgU3RyZWFtID0gJ3N0cmVhbSdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQXR0YWNobWVudCB7XG4gICB0eXBlOiBBdHRhY2htZW50XG4gICBuYW1lOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIEF0dGFjaG1lbnRGaWxlIGltcGxlbWVudHMgSUF0dGFjaG1lbnQge1xuICAgdHlwZTogQXR0YWNobWVudCA9IEF0dGFjaG1lbnQuRmlsZVxuICAgbmFtZTogc3RyaW5nXG4gICBmaWxlOiBzdHJpbmdcblxuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgICB0aGlzLmZpbGUgPSBmaWxlUGF0aFxuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXR0YWNobWVudFN0cmVhbSBpbXBsZW1lbnRzIElBdHRhY2htZW50IHtcbiAgIHR5cGU6IEF0dGFjaG1lbnQgPSBBdHRhY2htZW50LlN0cmVhbVxuICAgbmFtZTogc3RyaW5nXG4gICBzdHJlYW06IHN0cmluZ1xuXG4gICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHN0cmVhbTogc3RyaW5nKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgICB0aGlzLnN0cmVhbSA9IHN0cmVhbVxuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgR21haWxXcml0ZVN0cmVhbU9wdGlvbnMge1xuICAgZnJvbTogc3RyaW5nID0gJydcbiAgIHRvOiBzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KClcbiAgIGNjOiBzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KClcbiAgIGJjYzogc3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpXG4gICBzdWJqZWN0OiBzdHJpbmcgPSAnJ1xuICAgYm9keTogc3RyaW5nIHwgU3RyZWFtUmVmID0gJydcbiAgIGF0dGFjaG1lbnRzOiBJQXR0YWNobWVudFtdID0gbmV3IEFycmF5PElBdHRhY2htZW50PigpXG4gICBzdHJlYW1PcHRpb25zOiBXcml0YWJsZU9wdGlvbnMgPSB7fVxuXG4gICBjb25zdHJ1Y3RvcigpIHtcblxuICAgfVxuXG4gICBzdGF0aWMgZnJvbVN0ZXAoaW5mbzogU3RlcEluZm8pOiBHbWFpbFdyaXRlU3RyZWFtT3B0aW9ucyB7XG4gICAgICBsZXQgb3B0aW9ucyA9IG5ldyBHbWFpbFdyaXRlU3RyZWFtT3B0aW9ucygpXG5cbiAgICAgIGlmKGluZm8uZnJvbSA9PSBudWxsIHx8IHR5cGVvZiBpbmZvLmZyb20gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGEgbWlzc2luZyBvciBpbmNvcnJlY3QgJ2Zyb20nIG9wdGlvbiBmcm9tIGEgR21haWwgcGx1Z2luIHN0ZXAuIEVuc3VyZSBpdCdzIHByb3ZpZGVkIGFuZCB0aGF0IGl0IGlzIGEgc3RyaW5nLmApXG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMuZnJvbSA9IGluZm8uZnJvbVxuXG4gICAgICBpZihpbmZvLnRvID09IG51bGwpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRW5jb3VudGVyZWQgYSBtaXNzaW5nICd0bycgb3B0aW9uIGZyb20gYSBHbWFpbCBwbHVnaW4gc3RlcC4gRW5zdXJlIGl0J3MgcHJvdmlkZWQgYW5kIHRoYXQgaXQgaXMgYSBzdHJpbmcgb3Igc3RyaW5nIGFycmF5LmApXG4gICAgICB9XG5cbiAgICAgIGlmKHR5cGVvZiBpbmZvLnRvID09PSAnc3RyaW5nJykge1xuICAgICAgICAgb3B0aW9ucy50byA9IFtpbmZvLnRvXVxuICAgICAgfSBlbHNlIGlmKEFycmF5LmlzQXJyYXkoaW5mby50bykpIHtcbiAgICAgICAgIG9wdGlvbnMudG8gPSBpbmZvLnRvXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkICd0bycgb3B0aW9uIGVuY291dG5lcmVkIGluIGEgZ21haWwgcGx1Z2luLiBJdCdzIGV4cGN0ZWQgdG8gYmUgYSBzdHJpbmcgb3IgYSBzdHJpbmcgYXJyYXlgKVxuICAgICAgfVxuXG4gICAgICBpZih0eXBlb2YgaW5mby5jYyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgIG9wdGlvbnMuY2MgPSBbaW5mby5jY11cbiAgICAgIH0gZWxzZSBpZihBcnJheS5pc0FycmF5KGluZm8uY2MpKSB7XG4gICAgICAgICBvcHRpb25zLmNjID0gaW5mby5jY1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCAnY2MnIG9wdGlvbiBlbmNvdXRuZXJlZCBpbiBhIGdtYWlsIHBsdWdpbi4gSXQncyBleHBjdGVkIHRvIGJlIGEgc3RyaW5nIG9yIGEgc3RyaW5nIGFycmF5YClcbiAgICAgIH1cblxuICAgICAgaWYodHlwZW9mIGluZm8uYmNjID09PSAnc3RyaW5nJykge1xuICAgICAgICAgb3B0aW9ucy5iY2MgPSBbaW5mby5iY2NdXG4gICAgICB9IGVsc2UgaWYoQXJyYXkuaXNBcnJheShpbmZvLmJjYykpIHtcbiAgICAgICAgIG9wdGlvbnMuYmNjID0gaW5mby5iY2NcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgJ2JjYycgb3B0aW9uIGVuY291dG5lcmVkIGluIGEgZ21haWwgcGx1Z2luLiBJdCdzIGV4cGN0ZWQgdG8gYmUgYSBzdHJpbmcgb3IgYSBzdHJpbmcgYXJyYXlgKVxuICAgICAgfVxuXG4gICAgICBpZihpbmZvLnN1YmplY3QgIT0gbnVsbCkge1xuICAgICAgICAgaWYodHlwZW9mIGluZm8uc3ViamVjdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuc3ViamVjdCA9IGluZm8uc3ViamVjdFxuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCAnc3ViamVjdCcgb3B0aW9uIGVuY291bnRlcmVkIGluIGEgZ21haWwgc3RlcC4gSXQncyBleHBlY3RlZCB0byBiZSBhIHN0cmluZ2ApXG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKGluZm8uYm9keSAhPSBudWxsKSB7XG4gICAgICAgICBpZih0eXBlb2YgaW5mby5ib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgb3B0aW9ucy5ib2R5ID0gaW5mby5ib2R5XG4gICAgICAgICB9IGVsc2UgaWYodHlwZW9mIGluZm8uYm9keSA9PT0gJ29iamVjdCcgJiYgaW5mby5ib2R5LnN0cmVhbSAhPSBudWxsKSB7XG4gICAgICAgICAgICBvcHRpb25zLmJvZHkgPSBuZXcgU3RyZWFtUmVmKGluZm8uYm9keS5zdHJlYW0pXG4gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkICdib2R5JyBvcHRpb24gZW5jb3VudGVyZWQgaW4gYSBnbWFpbCBzdGVwLiB0J3MgZXhwZWN0ZWQgdG8gYmUgYSBzdHJpbmcsIG9yIGFuIG9iamVjdCBsaXRlcmFsIHdpdGggYSBzdHJlYW0gcHJvcGVydHkuYClcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IGlzVmFsaWRBdHRhY2htZW50ID0gKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgaWYoaXRlbS5uYW1lID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgfVxuICAgICAgICAgXG4gICAgICAgICBpZihpdGVtLmZpbGUgPT0gbnVsbCAmJiBpdGVtLnN0cmVhbSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYoaXRlbS5maWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgaXRlbS5maWxlID09PSAnc3RyaW5nJ1xuICAgICAgICAgfVxuXG4gICAgICAgICBpZihpdGVtLnN0cmVhbSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGl0ZW0uc3RyZWFtID09PSAnc3RyaW5nJ1xuICAgICAgICAgfVxuXG4gICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgbGV0IGlzRmlsZUF0dGFjaG1lbnQgPSAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICByZXR1cm4gaXRlbS5maWxlICE9IG51bGxcbiAgICAgIH1cblxuICAgICAgbGV0IGlzU3RyZWFtQXR0YWNobWVudCA9IChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgIHJldHVybiBpdGVtLnN0cmVhbSAhPSBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmKGluZm8uYXR0YWNobWVudHMgIT0gbnVsbCkge1xuICAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkoaW5mby5hdHRhY2htZW50cykpIHtcbiAgICAgICAgICAgIGluZm8uYXR0YWNobWVudHMgPSBbaW5mby5hdHRhY2htZW50c11cbiAgICAgICAgIH1cblxuICAgICAgICAgZm9yKGxldCBhdHRhY2htZW50IG9mIGluZm8uYXR0YWNobWVudHMpIHtcbiAgICAgICAgICAgIGlmKCFpc1ZhbGlkQXR0YWNobWVudChhdHRhY2htZW50KSkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkICdhdHRhY2htZW50cycgb3B0aW9uIGVuY291bnRlcmVkIGluIGEgZ21haWwgc3RlcC5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihpc0ZpbGVBdHRhY2htZW50KGF0dGFjaG1lbnQpKSB7XG4gICAgICAgICAgICAgICBvcHRpb25zLmF0dGFjaG1lbnRzLnB1c2gobmV3IEF0dGFjaG1lbnRGaWxlKGF0dGFjaG1lbnQubmFtZSwgYXR0YWNobWVudC5maWxlKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoaXNTdHJlYW1BdHRhY2htZW50KGF0dGFjaG1lbnQpKSB7XG4gICAgICAgICAgICAgICBvcHRpb25zLmF0dGFjaG1lbnRzLnB1c2gobmV3IEF0dGFjaG1lbnRTdHJlYW0oYXR0YWNobWVudC5uYW1lLCBhdHRhY2htZW50LnN0cmVhbSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKGluZm8uc3RyZWFtT3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgICBvcHRpb25zLnN0cmVhbU9wdGlvbnMgPSBpbmZvLnN0cmVhbU9wdGlvbnNcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9wdGlvbnNcbiAgIH1cblxufSJdfQ==