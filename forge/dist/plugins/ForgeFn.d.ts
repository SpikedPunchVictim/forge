import { Readable, Writable, Transform } from 'readable-stream';
import { IPlugin } from "./IPlugin";
import { IBuildState } from '../core/BuildState';
import { IStep } from "../core/Step";
export declare class ForgeFn implements IPlugin {
    static readonly type: string;
    readonly name: string;
    createStream(step: IStep): Transform;
    read(state: IBuildState, step: IStep): Promise<Readable>;
    write(state: IBuildState, step: IStep): Promise<Writable>;
    transform(state: IBuildState, step: IStep): Promise<Transform>;
}
