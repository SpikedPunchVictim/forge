import { Readable } from 'readable-stream';
export declare class NoOpReadStream extends Readable {
    constructor();
    _read(): void;
}
