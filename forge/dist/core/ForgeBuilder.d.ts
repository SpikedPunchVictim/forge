/// <reference types="node" />
import { BuildRecord } from './BuildRecord';
import { ForgeConfig, ForgeOptions } from './ForgeOptions';
import { NamedPlugin } from './NamedPlugin';
import { ForgePipeline, IForgePipeline } from './ForgeTransform';
import { ILogger } from '../utils/Logger';
import { EventEmitter } from 'events';
export declare class ForgeBuilder extends EventEmitter {
    forgeConfig: ForgeConfig;
    readonly options: ForgeOptions;
    private pipelineToStateMap;
    constructor(config: ForgeConfig, options: ForgeOptions);
    get pipelines(): Array<IForgePipeline>;
    get plugins(): Array<NamedPlugin>;
    reset(): void;
    get logger(): ILogger;
    /**
     * Builds all of the projects. The entire build process is tracked
     * through a BuildRecord. This contains each stage's vaults, as well
     * as data associated with each stage of a build.
     */
    build(): Promise<BuildRecord>;
    private buildPipeline;
    runPipelineScript(pipeline: ForgePipeline, scriptName: string, args: Array<any>): any;
}
