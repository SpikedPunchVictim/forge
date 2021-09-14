import { IPlugin } from '../plugins/IPlugin';
export declare class NamedPlugin {
    readonly name: string;
    readonly plugin: IPlugin;
    constructor(name: string, plugin: IPlugin);
}
