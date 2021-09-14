import { IGoogleRateLimiter } from "./RateLimiter";
import { StepInfo } from '@spikedpunch/forge';
import { GooglePluginOptions } from "./Plugin";
import { ReadableOptions, WritableOptions } from "readable-stream";
export declare class GmailReadStreamOptions {
    labels: string[];
    includeSpamTrash: boolean;
    includeAttachments: boolean;
    maxResults: number;
    query: string;
    rateLimiter: IGoogleRateLimiter;
    userId: string | undefined;
    streamOptions: ReadableOptions;
    constructor();
    static fromStep(info: StepInfo, pluginOptions: GooglePluginOptions): GmailReadStreamOptions;
}
export declare class StreamRef {
    readonly alias: string;
    constructor(alias: string);
}
export declare enum Attachment {
    File = "file",
    Stream = "stream"
}
export interface IAttachment {
    type: Attachment;
    name: string;
}
export declare class AttachmentFile implements IAttachment {
    type: Attachment;
    name: string;
    file: string;
    constructor(name: string, filePath: string);
}
export declare class AttachmentStream implements IAttachment {
    type: Attachment;
    name: string;
    stream: string;
    constructor(name: string, stream: string);
}
export declare class GmailWriteStreamOptions {
    from: string;
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string | StreamRef;
    attachments: IAttachment[];
    streamOptions: WritableOptions;
    constructor();
    static fromStep(info: StepInfo): GmailWriteStreamOptions;
}
