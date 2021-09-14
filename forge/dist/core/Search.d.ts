import { NamedPlugin } from "./NamedPlugin";
import { IForgePipeline } from "./ForgeTransform";
export declare class Search {
    private globalPlugins;
    constructor(globalPlugins: Array<NamedPlugin>);
    /**
     * Find a plugin from the perspective of a Transform
     *
     * @param name The name of the plugin
     * @param transform The tansform
     */
    findPlugin(name: string, transform: IForgePipeline): NamedPlugin | import("..").IPlugin | undefined;
}
