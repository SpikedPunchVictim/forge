import { ForgePipeline } from './ForgeTransform';
import { BuildRecord } from './BuildRecord';
import { ILogger } from '../utils/Logger';
import { ForgeOptions } from './ForgeOptions';
export interface IBuildState {
    readonly pipeline: ForgePipeline;
    readonly record: BuildRecord;
    readonly cwd: string;
    readonly logger: ILogger;
    vault: any;
    elapsedTimeMs: number;
    /**
     * Finds the absolute path to a file. This is based on the resolve
     * definitions and cwd.
     *
     * @param filePath The relative Path to a file
     */
    findFile(relativePath: string): Promise<string | undefined>;
    /**
     * Searches for multiple files matching  globbed pattern. This also
     * works for non-globbed patterns.
     *
     * @param relativeGlobPath A globbed or not globbed file path
     */
    findManyFiles(relativeGlobPath: string): Promise<string[]>;
    /**
     * Converts a list of relative file paths to absolute file paths. It
     * ensures that each file also exists.
     *
     * @param relativeFilePaths List of relative files
     */
    toAbsolute(relativeFilePaths: string | string[]): Promise<string[]>;
}
export declare class BuildState implements IBuildState {
    readonly pipeline: ForgePipeline;
    readonly record: BuildRecord;
    readonly cwd: string;
    readonly logger: ILogger;
    vault: any;
    elapsedTimeMs: number;
    constructor(pipeline: ForgePipeline, record: BuildRecord, options: ForgeOptions);
    /**
     * Searches for a file within the resolution scope of a transform
     *
     * @param filePath The relative or absolute file path
     */
    findFile(filePath: string): Promise<string | undefined>;
    findManyFiles(relativeGlobPath: string): Promise<string[]>;
    toAbsolute(relativeFilePaths: string | string[]): Promise<string[]>;
}
