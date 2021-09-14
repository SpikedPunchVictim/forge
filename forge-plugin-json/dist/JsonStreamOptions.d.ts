import { IBuildState, StepInfo } from "@spikedpunch/forge";
import { StreamMode } from "./Plugin";
export declare class JsonStreamOptions {
    files: string[];
    outFile: string;
    mode: StreamMode;
    space: number;
    constructor(files?: string[], outFile?: string, mode?: StreamMode, space?: number);
    static fromStep(state: IBuildState, info: StepInfo): Promise<JsonStreamOptions>;
}
