import { IStep } from './Step'
import { IBuildState } from './BuildState'
import { defer } from '../utils/Promise'
import { EventEmitter } from 'events'
import { IStreamTrait, IStreamTraitContainer, StreamTraitContainer } from '../traits/StreamTrait'
import { IPipelineNode, PipelineNode } from './PipelineNode'


export interface IPipeline {
   readonly nodes: IPipelineNode[]
   get(alias: string): IPipelineNode | undefined
}

/**
 * This class represents a series of PipelineNodes that are
 * connected to each other. Each Node represnets a Step, which in
 * turn represents a stream.
 */
export class Pipeline extends EventEmitter implements IPipeline {
   readonly stepMap: Map<string, PipelineNode>

   get nodes(): IPipelineNode[] {
      return Array.from(this.stepMap.values())
   }

   private constructor(stepMap: Map<string, PipelineNode>) {
      super()
      this.stepMap = stepMap
   }

   static toPipeline(steps: IStep[]): Pipeline {
      /*
         We build up the Pipeline Tree here, connecting each of the
         dependent steps to one another.

         We don't start piping the data here, we just setup the local
         connections in preparation for the run.
      */

      let stepMap = new Map<string, PipelineNode>()

      for (let step of steps) {
         stepMap.set(step.alias, new PipelineNode(step))
      }

      for (let node of stepMap.values()) {
         for (let use of node.step.use) {
            let ref = stepMap.get(use)

            if (ref === undefined) {
               throw new Error(`A Step (${node.step.alias}) references a 'use' step (${use}) that does not exist`)
            }

            node.prev.push(ref)
            ref.next.push(node)
         }
      }

      // let starters = Array.from(stepMap.values()).filter(n => n.prev.length == 0)
      // for (let node of starters) {
      //    let str = `[${node.alias}]`
      //    str += ` --> [${node.next.map(n => n.alias).join(' | ')}]`

      //    for(let next of node.next) {
      //       str += ` --> [${node.next.map(n => n.alias).join(' | ')}]`
      //    }
      //    console.log(str)
      // }

      return new Pipeline(stepMap)
   }

   get(alias: string): IPipelineNode | undefined {
      return this.stepMap.get(alias)
   }

   async run(state: IBuildState): Promise<void> {
      /*
         For running streams we:
            1) Create all streams in each PipelineNode
            2) Connect the streams
            3) Monitor the streams until they finish/error
      */
      let nodes = this.nodes as PipelineNode[]

      for (let node of nodes) {
         await node.makeStream(state)
      }

      await this.preProcessNodes(nodes)

      let def = defer<void>()

      let nodeCount = this.stepMap.size
      let closeCount = 0

      let onClose = () => {
         closeCount++

         if(closeCount >= nodeCount) {
            def.resolve()
         }
      }

      let onError = (err: Error) => {
         for (let node of nodes) {
            node.stream?.destroy()
         }

         def.reject(err)
      }

      let self = this
      for (let node of nodes) {
         if(node.stream == null) {
            continue
         }

         //@ts-ignore
         if(node.stream.writable) {
            node.stream?.on('finish', onClose)
         //@ts-ignore
         } else if(node.stream.readable) {
            node.stream?.on('end', onClose)
         } else {
            console.log('huh?')
         }

         node.stream?.on('error', onError)
         node.stream?.on('rate', data => {
            self.emit('rate', {
               alias: node.alias,
               progress: data.progress,
               label: data.label
            })
         })
      }

      for (let node of nodes) {
         await node.connect(state)
      }

      return def.promise
   }

   private async preProcessNodes(nodes: PipelineNode[]): Promise<void> {
      /*
         For Pre Processing the Nodes, we iterate through all of
         the streams and:
            1) Collect all Stream Traits
            2) Apply the Traits
      */

      let streams = nodes.map(node => node.stream)
      let traits = new Array<IStreamTrait>()

      for(let stream of streams) {
         if(!StreamTraitContainer.hasTraits(stream)) {
            continue  
         }

         // @ts-ignore
         let cast = stream as IStreamTraitContainer
         await cast.setTraits(traits)
      }

      for(let trait of traits) {
         await trait.apply(this)
      }
   }
}
