import { IPlugin } from './plugins/IPlugin';
import { IEnvoy } from './plugins/IEnvoy';
import { ForgeConfig, ForgeOptions } from './core/ForgeOptions';
import { BuildRecord, ExportRecord } from './core/BuildRecord';
import { IBuildState } from './core/BuildState';
import { IStep, StepInfo } from './core/Step';
export * from './streams';
export * from './traits';
export * from './utils';
export { BuildRecord, ExportRecord, ForgeOptions, IBuildState, IEnvoy, IPlugin, IStep, StepInfo };
export declare function build(config: ForgeConfig | string, options?: ForgeOptions): Promise<BuildRecord>;