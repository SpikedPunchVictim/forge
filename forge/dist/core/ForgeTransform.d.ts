import { IBuildState } from './BuildState';
import { NamedPlugin } from './NamedPlugin';
import { IPlugin } from '../plugins/IPlugin';
import { IStep } from './Step';
import { FileSearchScope } from './FileSearchScope';
import { GenericObject } from './ConfigBuilder';
export interface IForgeScript {
    init: (state: IBuildState) => Promise<GenericObject>;
    beforeRun: (state: IBuildState) => Promise<boolean>;
    afterRun: (state: IBuildState) => Promise<boolean>;
}
/**
 * An empty implementation of IForgeScript
 */
export declare class EmptyForgeScript implements IForgeScript {
    init(state: IBuildState): Promise<GenericObject>;
    beforeRun(state: IBuildState): Promise<boolean>;
    afterRun(state: IBuildState): Promise<boolean>;
}
export interface IForgePipeline {
    name: string;
    plugins: Array<NamedPlugin>;
    script: IForgeScript;
    steps: IStep[];
    readonly search: FileSearchScope;
    /**
     * Searches this tranform for a plugin. If none is found, undefined is returned.
     *
     * @param name The name of the plugin
     */
    findPlugin(name: string): IPlugin | undefined;
}
export declare class ForgePipeline implements IForgePipeline {
    name: string;
    plugins: Array<NamedPlugin>;
    script: IForgeScript;
    steps: Array<IStep>;
    readonly search: FileSearchScope;
    constructor(name: string, plugins: Array<NamedPlugin>, script: IForgeScript, steps: Array<IStep>, search: FileSearchScope);
    /**
     * Searches this tranform for a plugin. If none is found, undefined is returned.
     *
     * @param name The name of the plugin
     */
    findPlugin(name: string): IPlugin | undefined;
}
