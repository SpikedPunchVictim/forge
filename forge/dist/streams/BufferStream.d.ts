import { Transform, TransformOptions } from 'readable-stream';
export declare class BufferStream extends Transform {
    readonly size: number;
    private buffer;
    private bufferEncoding;
    get objectMode(): boolean;
    constructor(size?: number, options?: TransformOptions);
    _transform(chunk: any, encoding: string, cb: (error?: Error | undefined, data?: any) => void): void;
    _flush(cb: (error?: Error | undefined, data?: any) => void): void;
}
