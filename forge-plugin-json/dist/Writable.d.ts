import { Writable } from 'readable-stream';
export declare class JsonWritableStream extends Writable {
    readonly outFile: string;
    readonly space: number;
    private stream;
    constructor(outFile: string, space?: number);
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void;
    _final(callback: (error?: Error | null) => void): void;
}
