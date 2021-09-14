/// <reference types="node" />
import { IStep } from './Step';
import { IBuildState } from './BuildState';
import { EventEmitter } from 'events';
import { IPipelineNode, PipelineNode } from './PipelineNode';
export interface IPipeline {
    readonly nodes: IPipelineNode[];
    get(alias: string): IPipelineNode | undefined;
}
/**
 * This class represents a series of PipelineNodes that are
 * connected to each other. Each Node represnets a Step, which in
 * turn represents a stream.
 */
export declare class Pipeline extends EventEmitter implements IPipeline {
    readonly stepMap: Map<string, PipelineNode>;
    get nodes(): IPipelineNode[];
    private constructor();
    static toPipeline(steps: IStep[]): Pipeline;
    get(alias: string): IPipelineNode | undefined;
    run(state: IBuildState): Promise<void>;
    private preProcessNodes;
}
