import { Readable, Writable, Transform } from 'readable-stream'
import { NoOpReadStream } from '../streams/NoOpStream'
import { WriteToManyStream } from '../streams/WriteToManyStream'
import { IBuildState } from './BuildState'
import { IStep } from './Step'

export interface IPipelineNode {
   readonly prev: IPipelineNode[]
   readonly step: IStep
   readonly next: IPipelineNode[]

   readonly alias: string
   readonly stream: Readable | Writable | Transform | undefined
}

/**
 * This class represents a single Node in a Pipeline. Each Node
 * is connected to other Nodes upstream (prev) and downstream (next).
 */
export class PipelineNode implements IPipelineNode {
   readonly prev: PipelineNode[] = new Array<PipelineNode>()
   readonly step: IStep
   readonly next: PipelineNode[] = new Array<PipelineNode>()

   get stream(): Readable | Writable | Transform | undefined {
      return this._stream
   }

   get alias(): string {
      return this.step.alias
   }

   private connected: Array<string>
   private _stream: Readable | Writable | Transform | undefined = undefined

   constructor(step: IStep) {
      this.step = step
      this.connected = new Array<string>()
   }

   async connect(state: IBuildState): Promise<void> {
      if(this.stream === undefined) {
         await this.makeStream(state)
      }

      for(let prev of this.prev) {
         prev.pipe(this)
      }

      this.pipe(this.next)
   }

   pipe(nodes: PipelineNode | PipelineNode[]): void {
      let pipeNode = (node: PipelineNode) => {
         if(this.connected.includes(node.step.alias)) {
            return
         }
   
         if(node.stream === undefined) {
            throw new Error(`Cannot connect PipelineNodes that have no streams`)
         }
   
         //console.log(`piping [${this.alias}] --> [${node.alias}]`)
   
         //@ts-ignore
         this.stream.pipe(node.stream)
         //this.stream?.on('data', data => console.log(`${this.alias} ${data}`))
   
         this.connected.push(node.step.alias)
      }

      if(!Array.isArray(nodes)) {
         pipeNode(nodes)
         return
      }

      if(nodes.length == 0) {
         return
      }

      if(nodes.length == 1) {
         pipeNode(nodes[0])
      } else if (nodes.length > 1) {
         // If we're writing to multiple streams, we wrap them in a WriteToManyStream to
         // manage backpressure from all of them.
         let writeToMany = new WriteToManyStream(nodes.map(it => it.stream as Writable))
         this.stream?.pipe(writeToMany)
         this.connected.push(...nodes.map(it => it.alias))
      }
   }

   /**
    * Based on the position in the Pipeline, will setup
    * this node's stream.
    */
   async makeStream(state: IBuildState): Promise<Readable | Writable | Transform> {
      if(this.stream !== undefined) {
         return this.stream
      }

      let hasSource = this.prev.length > 0
      let hasDest = this.next.length > 0

      if(!hasSource && !hasDest) {
         this._stream = new NoOpReadStream()
         return this._stream
      }

      if (!hasSource && hasDest) {
         this._stream = await this.step.plugin.read(state, this.step)
      } 

      if(hasSource && !hasDest) {
         this._stream = await this.step.plugin.write(state, this.step)
      }
      
      if(hasSource && hasDest) {
         this._stream = await this.step.plugin.transform(state, this.step) 
      }
    
      if(this.stream === undefined) {
         throw new Error(`Could not create stream from the step ${this.step.alias}`)
      }

      return this.stream
   }
}
