export interface ILogger {
    error: (message: string) => void;
    log: (message: string) => void;
    info: (message: string) => void;
    verbose: (message: string) => void;
    warn: (mesage: string) => void;
}
declare class EmptyLoggerClass implements ILogger {
    error(message: string, ...optionalParams: any[]): void;
    log(message: string, ...optionalParams: any[]): void;
    info(message: string, ...optionalParams: any[]): void;
    verbose(message: string, ...optionalParams: any[]): void;
    warn(message: string, ...optionalParams: any[]): void;
}
export declare const EmptyLogger: EmptyLoggerClass;
export declare class ConsoleLogger implements ILogger {
    error(message: string, ...optionalParams: any[]): void;
    log(message: string, ...optionalParams: any[]): void;
    info(message: string, ...optionalParams: any[]): void;
    verbose(message: string, ...optionalParams: any[]): void;
    warn(message: string, ...optionalParams: any[]): void;
}
export {};
