import { IBuildState, IEnvoy, IPlugin, IStep } from '@spikedpunch/forge';
import { Readable, Writable, Transform } from 'readable-stream';
import { S3 } from 'aws-sdk';
export declare class S3Envoy implements IEnvoy {
    data: any;
    metadata: any;
    constructor();
}
export declare type S3PluginOptions = {
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
    bucket?: string;
    s3Options?: S3.ClientConfiguration;
};
export declare class S3Plugin implements IPlugin {
    readonly name: string;
    readonly options: S3PluginOptions;
    constructor(options?: S3PluginOptions);
    read(state: IBuildState, step: IStep): Promise<Readable>;
    write(state: IBuildState, step: IStep): Promise<Writable>;
    transform(state: IBuildState, step: IStep): Promise<Transform>;
}
