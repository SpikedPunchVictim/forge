import { Transform } from "readable-stream";
export declare class JsonTransformStream extends Transform {
    private writeFileStream;
    private cache;
    constructor(outFile?: string);
    _transform(chunk: any, encoding: string, callback: (error?: Error | undefined, data?: any) => void): void;
    _final(callback: (error?: Error | undefined, data?: any) => void): void;
}
