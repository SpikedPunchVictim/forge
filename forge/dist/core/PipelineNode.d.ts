import { Readable, Writable, Transform } from 'readable-stream';
import { IBuildState } from './BuildState';
import { IStep } from './Step';
export interface IPipelineNode {
    readonly prev: IPipelineNode[];
    readonly step: IStep;
    readonly next: IPipelineNode[];
    readonly alias: string;
    readonly stream: Readable | Writable | Transform | undefined;
}
/**
 * This class represents a single Node in a Pipeline. Each Node
 * is connected to other Nodes upstream (prev) and downstream (next).
 */
export declare class PipelineNode implements IPipelineNode {
    readonly prev: PipelineNode[];
    readonly step: IStep;
    readonly next: PipelineNode[];
    get stream(): Readable | Writable | Transform | undefined;
    get alias(): string;
    private connected;
    private _stream;
    constructor(step: IStep);
    connect(state: IBuildState): Promise<void>;
    pipe(nodes: PipelineNode | PipelineNode[]): void;
    /**
     * Based on the position in the Pipeline, will setup
     * this node's stream.
     */
    makeStream(state: IBuildState): Promise<Readable | Writable | Transform>;
}
