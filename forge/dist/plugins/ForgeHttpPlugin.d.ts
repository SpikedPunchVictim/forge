import { Readable, Transform, Writable } from "readable-stream";
import { IBuildState } from "../core/BuildState";
import { IStep } from "../core/Step";
import { IPlugin } from "./IPlugin";
export declare class ForgeHttpPlugin implements IPlugin {
    static readonly type: string;
    readonly name: string;
    /**
     *
     *
     *
     *
     * @param state
     * @param step
     * @returns
     */
    read(state: IBuildState, step: IStep): Promise<Readable>;
    write(state: IBuildState, step: IStep): Promise<Writable>;
    transform(state: IBuildState, step: IStep): Promise<Transform>;
}
