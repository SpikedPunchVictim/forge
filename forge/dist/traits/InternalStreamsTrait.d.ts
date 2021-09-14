import { Transform, Writable, Readable, PassThrough } from 'readable-stream';
import { IPipeline } from '../core/Pipeline';
import { IStreamTrait } from "./StreamTrait";
/**
 * This Stream Trait stores references a set of streams based on their alias
 */
export declare class InternalStreamsTrait implements IStreamTrait {
    readonly type: string;
    get streams(): string[];
    protected _streams: Map<string, Readable | Writable | Transform | PassThrough | undefined>;
    constructor(streamNames: string[]);
    apply(pipeline: IPipeline): Promise<void>;
    get(name: string): Readable | Writable | Transform | PassThrough | undefined;
    pair(name: string, stream: Readable | Writable | Transform | PassThrough): void;
}
