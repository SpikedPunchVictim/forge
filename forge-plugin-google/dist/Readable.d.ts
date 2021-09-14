import { Readable, ReadableOptions } from "readable-stream";
import { GmailReadStreamOptions } from "./GoogleStreamOptions";
import { GoogleAuth, JWT, OAuth2Client } from 'google-auth-library';
export declare type Attachment = {
    filename: string;
    mimeType: string;
    attachment: any;
};
export declare type GmailObject = {
    email: any;
    attachments: Attachment[];
};
export declare class GmailReadableStream extends Readable {
    readonly options: GmailReadStreamOptions;
    readonly userId: string;
    readonly auth: GoogleAuth | JWT | OAuth2Client | string;
    private gmail;
    private pageToken;
    private messageIds;
    private finished;
    constructor(readOptions: GmailReadStreamOptions, authClient: GoogleAuth | JWT | OAuth2Client, userId: string, options?: ReadableOptions);
    _read(): Promise<void>;
    private getNextMessageIds;
}
