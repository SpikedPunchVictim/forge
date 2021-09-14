import { Writable, WritableOptions } from 'readable-stream';
/**
 * A WriteStream that can stream data between multiple
 * WriteStreams
 */
export declare class WriteToManyStream extends Writable {
    readonly streams: Writable[];
    readonly maxWriteAttempts: number;
    constructor(streams: Writable[], options?: WritableOptions, maxWriteAttempts?: number);
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void;
}
