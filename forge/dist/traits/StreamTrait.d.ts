import { Readable, Writable, Transform } from 'readable-stream';
import { IPipeline } from '../core/Pipeline';
export declare enum Trait {
    InternalStrams = "trait-internal-streams"
}
export interface IStreamTrait {
    readonly type: String;
    apply(pipeline: IPipeline): Promise<void>;
}
export interface IStreamTraitContainer {
    setTraits(traits: IStreamTrait[]): Promise<void>;
}
export declare abstract class StreamTraitContainer {
    static hasTraits(other: Readable | Writable | Transform | undefined): boolean;
}
