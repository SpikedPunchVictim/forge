import { Readable } from 'readable-stream';
/**
 * This class represents a JSON stream that streams full Objects
 */
export declare class JsonObjectReadStream extends Readable {
    readonly files: string[];
    constructor(files: string[]);
    _read(): void;
}
/**
 * This class implements a Readable stream that streams chunks
 */
export declare class JsonChunkReadStream extends Readable {
    readonly files: string[];
    private stream;
    private parser;
    private get isStreaming();
    constructor(files: string[]);
    _read(): void;
}
/**
 * This class implements a SAX-like JSON stream
 */
export declare class JsonSaxReadStream extends Readable {
    readonly files: string[];
    private stream;
    private get isStreaming();
    constructor(files: string[]);
    _read(): void;
}
