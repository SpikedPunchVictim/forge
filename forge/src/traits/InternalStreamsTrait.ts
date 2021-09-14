import { Transform, Writable, Readable, PassThrough } from 'readable-stream'
import { IPipeline } from '../core/Pipeline';
import { IStreamTrait, Trait } from "./StreamTrait";

/**
 * This Stream Trait stores references a set of streams based on their alias
 */
export class InternalStreamsTrait implements IStreamTrait {
   readonly type: string = Trait.InternalStrams

   get streams(): string[] {
      return Array.from(this._streams.keys())
   }

   protected _streams: Map<string, Readable | Writable | Transform | PassThrough | undefined>

   constructor(streamNames: string[]) {
      this._streams = new Map<string, Readable | Writable | Transform | PassThrough | undefined>()

      for(let name of streamNames) {
         this._streams.set(name, undefined)
      }
   }

   async apply(pipeline: IPipeline): Promise<void> {
      for(let name of this.streams) {
         let node = pipeline.get(name)

         if(node === undefined) {
            throw new Error(`InternalStreamsTrait encountered a stream alias that does not exist in the forge file. Ensure that all the stream aliases are spelled correctly and that they exist.`)
         }

         if(node.stream === undefined) {
            throw new Error(`A StreamTrait is being applied before the streams are created. Streams must be created before Traits can be applied.`)
         }

         this._streams.set(name, node.stream)
      }
   }

   get(name: string): Readable | Writable | Transform | PassThrough | undefined {
      return this._streams.get(name)
   }

   pair(name: string, stream: Readable | Writable | Transform | PassThrough): void {
      this._streams.set(name, stream)
   }
}