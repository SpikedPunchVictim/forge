import { Writable, WritableOptions } from "readable-stream";
import { S3StepOptions } from "./S3StepOptions";
export declare class S3WritableStream extends Writable {
    readonly options: S3StepOptions;
    private stream;
    private s3;
    private promise;
    constructor(stepOptions: S3StepOptions, options?: WritableOptions);
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void;
    _final(cb: (error?: Error | null) => void): Promise<void>;
}
