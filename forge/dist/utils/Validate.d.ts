declare type ValidateTypeHandler = (value: any) => boolean;
export declare type KeyValueType = {
    [key: string]: string | ValidateTypeHandler;
};
export declare type ObjectValidateMap = {
    required?: KeyValueType;
    optional?: KeyValueType;
    mutex?: KeyValueType[];
};
export declare class InvalidNameError extends Error {
    constructor(name: string);
}
/**
 * Represents the results of a validation run
 */
export declare class ValidationResult {
    get success(): boolean;
    readonly map: ObjectValidateMap;
    private errors;
    constructor(map: ObjectValidateMap);
    requiredNotFound(key: string): void;
    requiredFailedValidation(key: string): void;
    requiredWrongType(key: string): void;
    mutexDuplicate(key: string): void;
    expect(): string;
}
export declare class Validate {
    static resourceName(name: string): void;
    /**
     * Validates an Object
     *
     * Example usage:
     *
     *    Validate.object(obj, {
     *       required: {
     *          some: 'string'
     *          count: 'numbner',
     *          special: (value) => {
     *             // return true if the value is valid, otherwise false
     *          }
     *       },
     *       // We ignore optional values, but we declare them so we can include
     *       // them in any error messages. This helps inform the user.
     *       optional: {
     *          optional: 'string',
     *          dontneedme: 'number'
     *       },
     *       // Mutually exclusive properties
     *       mutex: [
     *          {
     *             sourcePath: 'string',
     *             sourceId: 'string'
     *          },
     *          {
     *             parentPath: 'string',
     *             parentId: 'string'
     *          }
     *       ]
     *     })
     *
     * @param obj The Object to validate
     * @param map The validatrion map containing the expected structure
     */
    static object(obj: any, map: ObjectValidateMap): ValidationResult;
    static enum(enm: any): ValidateTypeHandler;
    /**
     * Creates a method to validate a nested object
     *
     * @param map The Validation Map
     */
    static obj(map: ObjectValidateMap): ValidateTypeHandler;
}
export {};
