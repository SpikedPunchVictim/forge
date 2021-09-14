import { ForgePipeline } from './ForgeTransform'

export class ExportRecord {
   public pipeline: ForgePipeline
   public alias: string    // The Export alias
   public results: Array<any>

   constructor(pipeline: ForgePipeline, alias: string) {
      this.pipeline = pipeline
      this.alias = alias
      this.results = new Array<any>()
   }
}

/**
 * TODO:
 *    - Consider adding custom properties for plugins to store their records
 *      ie: What URLs were imported, data exported, etc
 */
export class BuildRecord {
   /**
    * Key: Transform name
    * Value: Transform
    */
   public pipelines: Map<string, ForgePipeline>

   /**
    * Key: Project Name
    * Value: Developer custom object
    */
   public vaults: Map<string, any>

   public results: Map<ExportRecord, { alias: string }>

   constructor(pipelines: Array<ForgePipeline>) {
      this.pipelines = new Map<string, ForgePipeline>(pipelines.map(t => [t.name, t]))
      this.vaults = new Map<string, any>()  // Key: project name   Value: Vault data
      this.results = new Map<ExportRecord, { alias: string }>()
   }
}