import { BuildRecord } from './BuildRecord'
import { BuildState, IBuildState } from './BuildState'
import { ForgeConfig, ForgeOptions } from './ForgeOptions'
import { NamedPlugin } from './NamedPlugin'
import { ForgePipeline, IForgePipeline } from './ForgeTransform'
import { EmptyLogger, ILogger } from '../utils/Logger'
import { Pipeline } from './Pipeline'
import { EventEmitter } from 'events'


/*-----------------------------------------------------------------------*
 * This class represents the logic and state containment for building
 * forge projects
 *----------------------------------------------------------------------*/
export class ForgeBuilder extends EventEmitter {
   public forgeConfig: ForgeConfig
   readonly options: ForgeOptions
   private pipelineToStateMap: Map<IForgePipeline, IBuildState>

   constructor(config: ForgeConfig, options: ForgeOptions) {
      super()
      this.forgeConfig = config
      this.options = options
      this.pipelineToStateMap = new Map<IForgePipeline, IBuildState>()
   }

   public get pipelines(): Array<IForgePipeline> {
      return this.forgeConfig.pipelines || []
   }

   public get plugins(): Array<NamedPlugin> {
      return this.forgeConfig.plugins
   }

   public reset(): void {
      this.pipelineToStateMap.clear()
   }

   public get logger(): ILogger {
      return this.options.logger || EmptyLogger
   }

   /**
    * Builds all of the projects. The entire build process is tracked
    * through a BuildRecord. This contains each stage's vaults, as well
    * as data associated with each stage of a build.
    */
   public async build(): Promise<BuildRecord> {
      this.reset()

      let record = new BuildRecord(this.pipelines)

      // Serially import
      for (let pipeline of this.pipelines) {
         await this.buildPipeline(pipeline, record)
      }

      return record
   }

   private async buildPipeline(pipeline: IForgePipeline, record: BuildRecord): Promise<void> {
      //let start = elapsedTime()
      let state = new BuildState(pipeline, record, this.options)

      record.vaults.set(pipeline.name, state.vault)

      await this.runPipelineScript(pipeline, 'beforeRun', [state])

      let pline = Pipeline.toPipeline(pipeline.steps)
      await pline.run(state)

      await this.runPipelineScript(pipeline, 'afterRun', [state])
   }

   runPipelineScript(pipeline: ForgePipeline, scriptName: string, args: Array<any>) {
      return pipeline.script[scriptName] ?
         pipeline.script[scriptName](...args) :
         Promise.resolve()
   }
}