import { Readable, Transform, Writable } from 'readable-stream';
import { IPlugin } from "./IPlugin";
import { IBuildState } from '../core/BuildState';
import { IStep } from "../core/Step";
export declare class ForgeBuffer implements IPlugin {
    static readonly type: string;
    readonly name: string;
    read(state: IBuildState, step: IStep): Promise<Readable>;
    write(state: IBuildState, step: IStep): Promise<Writable>;
    transform(state: IBuildState, step: IStep): Promise<Transform>;
}
