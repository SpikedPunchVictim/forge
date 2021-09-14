import { Readable, Writable, Transform } from 'readable-stream'
import { IPipeline } from '../core/Pipeline'

/*
   Stream Traits allow developers to add functionality
   to their streams that require knowledge of the whole
   Pipeline. For example, if a Stream (or a Step) references
   other streams in the Pipeline, they can add a Trait
   to get those references and pipe

*/

export enum Trait {
   InternalStrams = 'trait-internal-streams' 
}

export interface IStreamTrait {
   readonly type: String
   apply(pipeline: IPipeline): Promise<void>
}

export interface IStreamTraitContainer {
   setTraits(traits: IStreamTrait[]): Promise<void>
}

export abstract class StreamTraitContainer {
   static hasTraits(other: Readable | Writable | Transform | undefined): boolean {
      //@ts-ignore      
      return other != null && other.setTraits != null && (typeof other.setTraits === 'function')
   }
}
