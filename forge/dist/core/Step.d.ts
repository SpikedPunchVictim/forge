import { IPlugin } from "../plugins/IPlugin";
export declare type StepInfo = {
    alias: string;
    plugin: string;
    [key: string]: any;
};
export interface IStep {
    alias: string;
    plugin: IPlugin;
    readonly use: Array<string>;
    info: StepInfo;
}
export declare class Step implements IStep {
    readonly plugin: IPlugin;
    get alias(): string;
    readonly use: Array<string>;
    readonly info: StepInfo;
    constructor(info: StepInfo, plugin: IPlugin, use: string | string[]);
    /**
     * Ensures that the StepInfo contains the expected structure. Throws
     * an Error if it doesn't.
     *
     * @param info The info object
     */
    static validate(info: StepInfo): void;
}
