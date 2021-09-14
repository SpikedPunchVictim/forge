/**
 * Contains the logic to resolve file paths
 */
export declare class FileSearchScope {
    readonly dirs: Array<string>;
    private _merged;
    constructor(dirs?: Array<string>);
    find(relativePath: string): Promise<string | undefined>;
    /**
     * Searches for files matching a globbed pattern. A non-globbed
     * file path can also be used.
     *
     * @param relativeGlobPath A relative path that may or may not contain a globbed pattern
     * @param defaultResult Default value should a value not be found
     */
    findGlob(relativeGlobPath: string, defaultResult?: string[]): Promise<string[]>;
    add(dir: string | Array<string>): void;
    merge(scope: FileSearchScope): void;
}
