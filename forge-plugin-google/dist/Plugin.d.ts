import { IBuildState, IEnvoy, IPlugin, IStep } from '@spikedpunch/forge';
import { Readable, Writable, Transform } from 'readable-stream';
import { IGoogleRateLimiter } from './RateLimiter';
export declare class GoogleEnvoy implements IEnvoy {
    data: any;
    metadata: any;
    readonly options: GooglePluginOptions;
    constructor(options: GooglePluginOptions);
}
export declare type GoogleAuthJwt = {
    credsFile: string;
};
export declare type GoogleAuthOauth2 = {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    refreshToken: string;
};
export declare type GooglePluginAuth = {
    jwt?: GoogleAuthJwt;
    oauth2?: GoogleAuthOauth2;
};
export declare type GooglePluginOptions = {
    auth: GooglePluginAuth;
    email: string;
    rateLimiter?: IGoogleRateLimiter;
};
export declare class GmailPlugin implements IPlugin {
    readonly name: string;
    readonly options: GooglePluginOptions;
    readonly rateLimiter: IGoogleRateLimiter;
    constructor(options: GooglePluginOptions);
    read(state: IBuildState, step: IStep): Promise<Readable>;
    write(state: IBuildState, step: IStep): Promise<Writable>;
    transform(state: IBuildState, step: IStep): Promise<Transform>;
    private createAuthClient;
}
