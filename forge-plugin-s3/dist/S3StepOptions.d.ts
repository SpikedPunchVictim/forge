import { S3 } from 'aws-sdk';
import { StepInfo } from '@spikedpunch/forge';
import { S3PluginOptions } from './Plugin';
export declare class S3StepOptions {
    bucket: string;
    key: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
    s3Options?: S3.ClientConfiguration;
    static fromStep(info: StepInfo, options: S3PluginOptions): S3StepOptions;
}
