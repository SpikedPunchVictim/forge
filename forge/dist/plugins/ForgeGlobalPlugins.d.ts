import { NamedPlugin } from "../core/NamedPlugin";
import { IPlugin } from "./IPlugin";
declare class ForgeGlobalPlugins {
    private registeredPlugins;
    get plugins(): NamedPlugin[];
    get(name: string): IPlugin | undefined;
    register(name: string, plugin: IPlugin): void;
}
export declare let GlobalPlugins: ForgeGlobalPlugins;
export {};
