import { IStreamTraitContainer, IStreamTrait } from "@spikedpunch/forge";
import { Writable, WritableOptions } from "readable-stream";
import { GmailWriteStreamOptions } from "./GoogleStreamOptions";
import { GoogleAuth, JWT, OAuth2Client } from 'google-auth-library';
export declare class GmailCreateStream extends Writable implements IStreamTraitContainer {
    readonly options: GmailWriteStreamOptions;
    readonly auth: JWT | GoogleAuth | OAuth2Client;
    private internalStreamsTrait;
    constructor(createOptions: GmailWriteStreamOptions, auth: GoogleAuth | JWT | OAuth2Client, options?: WritableOptions);
    _write(chunk: any, encoding: string, cb: (error?: Error | null) => void): void;
    setTraits(traits: IStreamTrait[]): Promise<void>;
}
