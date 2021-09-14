import { IForgePipeline, IForgeScript } from './ForgeTransform';
import { ConsoleLogger, ILogger } from '../utils/Logger';
import { NamedPlugin } from './NamedPlugin';
import { StepInfo } from './Step';
import { FileSearchScope } from './FileSearchScope';
export declare type BuiltConfig = {
    [key: string]: any;
};
export declare type StepBuildParams = {
    config: BuiltConfig;
};
export declare type BuildStepFn = (params: StepBuildParams) => Promise<StepInfo>;
export declare type ResolvePathsFn = () => Promise<string[]>;
export declare class ForgeOptions {
    cwd?: string;
    logger?: ILogger;
    constructor(logger?: ConsoleLogger, cwd?: string);
}
export declare class ForgeConfig {
    resolve: FileSearchScope;
    script: IForgeScript;
    plugins: Array<NamedPlugin>;
    pipelines: Array<IForgePipeline>;
    constructor();
    static normalize(config: any, options: ForgeOptions): Promise<ForgeConfig>;
}
export declare function normalize(config: any, options: ForgeOptions): Promise<ForgeConfig>;
