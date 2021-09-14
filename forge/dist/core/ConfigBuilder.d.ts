export declare type GenericObject = {
    [key: string]: any;
};
export declare type BuildConfigFn = (builder: ConfigBuilder) => Promise<GenericObject>;
export declare class ConfigBuilder {
    constructor();
    /**
     * Retrieves an environment variable, or returns a default value if it doesn't exist
     *
     * @param envVar The environment variable to use
     * @param def The default value if the environment variable doesn't exist
     */
    env(envVar: string, def: string): string;
    /**
     * Reads in a jsonFile
     *
     * @param filePath The path to the JSON file
     */
    jsonFile(filePath: string): Promise<GenericObject>;
    /**
     * Reads in a JSON file whose path is provided in an environment variable,
     * or a default location if the environment variable doesn't exist.
     *
     * @param envVar The environment variable
     * @param def The efault value if the environment variable doesn't exist
     */
    jsonFileEnv(envVar: string, def: string): Promise<GenericObject>;
}
