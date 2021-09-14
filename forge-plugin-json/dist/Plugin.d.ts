import { IBuildState, IPlugin, IStep } from '@spikedpunch/forge';
import { Readable, Writable, Transform } from 'readable-stream';
export declare enum StreamMode {
    Object = 0,
    Sax = 1,
    Chunk = 2
}
/**
 *
 */
export declare class JsonPlugin implements IPlugin {
    readonly name: string;
    constructor();
    read(state: IBuildState, step: IStep): Promise<Readable>;
    write(state: IBuildState, step: IStep): Promise<Writable>;
    transform(state: IBuildState, step: IStep): Promise<Transform>;
}
