import { ForgePipeline } from './ForgeTransform';
export declare class ExportRecord {
    pipeline: ForgePipeline;
    alias: string;
    results: Array<any>;
    constructor(pipeline: ForgePipeline, alias: string);
}
/**
 * TODO:
 *    - Consider adding custom properties for plugins to store their records
 *      ie: What URLs were imported, data exported, etc
 */
export declare class BuildRecord {
    /**
     * Key: Transform name
     * Value: Transform
     */
    pipelines: Map<string, ForgePipeline>;
    /**
     * Key: Project Name
     * Value: Developer custom object
     */
    vaults: Map<string, any>;
    results: Map<ExportRecord, {
        alias: string;
    }>;
    constructor(pipelines: Array<ForgePipeline>);
}
