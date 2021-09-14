"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validate = exports.ValidationResult = exports.InvalidNameError = void 0;
var ValidateFailReason;
(function (ValidateFailReason) {
    ValidateFailReason["NotFound"] = "not-found";
    ValidateFailReason["WrongType"] = "wrong-type";
    ValidateFailReason["MutexDuplicate"] = "mutex-duplicate";
})(ValidateFailReason || (ValidateFailReason = {}));
// Optimization for precompiled Regex
const NameValidatidationRegex = /[^a-zA-Z0-9-_]/g;
class InvalidNameError extends Error {
    constructor(name) {
        super(`${name} is not a valid name. It must match the regex /[^a-zA-Z0-9-_]/g`);
    }
}
exports.InvalidNameError = InvalidNameError;
/**
 * Represents the results of a validation run
 */
class ValidationResult {
    constructor(map) {
        this.map = map;
        this.errors = new Map();
        // Initialize the Map
        for (let reason of Object.values(ValidateFailReason)) {
            this.errors.set(reason, new Array());
        }
    }
    get success() {
        for (let list of this.errors.values()) {
            if (list.length > 0) {
                return false;
            }
        }
        return true;
    }
    requiredNotFound(key) {
        let keys = this.errors.get(ValidateFailReason.NotFound);
        keys === null || keys === void 0 ? void 0 : keys.push(key);
    }
    requiredFailedValidation(key) {
        let keys = this.errors.get(ValidateFailReason.WrongType);
        keys === null || keys === void 0 ? void 0 : keys.push(key);
    }
    requiredWrongType(key) {
        let keys = this.errors.get(ValidateFailReason.WrongType);
        keys === null || keys === void 0 ? void 0 : keys.push(key);
    }
    mutexDuplicate(key) {
        let keys = this.errors.get(ValidateFailReason.MutexDuplicate);
        keys === null || keys === void 0 ? void 0 : keys.push(key);
    }
    expect() {
        let results = ``;
        if (this.map.required != null) {
            results += `The required fields: `;
            let count = 0;
            for (let key of Object.keys(this.map.required)) {
                results += `${count++ > 0 ? ', ' : ''}${key}`;
            }
            results += '. ';
        }
        if (this.map.optional != null) {
            results += `The optional fields: `;
            let count = 0;
            for (let key of Object.keys(this.map.optional)) {
                results += `${count++ > 0 ? ', ' : ''}${key}`;
            }
            results += '. ';
        }
        if (this.map.mutex != null) {
            results += `The mutually exclusive fields: `;
            for (let mutex of this.map.mutex) {
                let found = new Array();
                for (let key of Object.keys(mutex)) {
                    found.push(key);
                }
                results += `[${found.join(',')}] `;
            }
        }
        return results;
    }
}
exports.ValidationResult = ValidationResult;
class Validate {
    static resourceName(name) {
        if (name == null) {
            throw new InvalidNameError(name);
        }
        if (name == null || NameValidatidationRegex.test(name)) {
            throw new InvalidNameError(name);
        }
    }
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
    static object(obj, map) {
        let result = new ValidationResult(map);
        let testType = (key, value, type) => {
            if (typeof type === 'function') {
                if (!type(value)) {
                    result.requiredFailedValidation(key);
                    return;
                }
            }
            else if (typeof value !== type) {
                result.requiredWrongType(key);
                return;
            }
        };
        if (map.required != null) {
            for (let key of Object.keys(map.required)) {
                if (obj[key] == null) {
                    result.requiredNotFound(key);
                    continue;
                }
                testType(key, obj[key], map.required[key]);
            }
        }
        if (map.mutex != null) {
            for (let mutex of map.mutex) {
                let found = new Array();
                for (let key of Object.keys(mutex)) {
                    if (obj[key] != null) {
                        found.push(key);
                        testType(key, obj[key], mutex[key]);
                    }
                }
                if (found.length > 1) {
                    found.forEach(k => result.mutexDuplicate(k));
                }
            }
        }
        return result;
    }
    static enum(enm) {
        return (value) => {
            for (let enumValue of Object.values(enm)) {
                if (value === enumValue) {
                    return true;
                }
            }
            return false;
        };
    }
    /**
     * Creates a method to validate a nested object
     *
     * @param map The Validation Map
     */
    static obj(map) {
        return (value) => {
            let result = Validate.object(value, map);
            return result.success;
        };
    }
}
exports.Validate = Validate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsaWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvVmFsaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBWUEsSUFBSyxrQkFJSjtBQUpELFdBQUssa0JBQWtCO0lBQ3BCLDRDQUFzQixDQUFBO0lBQ3RCLDhDQUF3QixDQUFBO0lBQ3hCLHdEQUFrQyxDQUFBO0FBQ3JDLENBQUMsRUFKSSxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBSXRCO0FBRUQscUNBQXFDO0FBQ3JDLE1BQU0sdUJBQXVCLEdBQUcsaUJBQWlCLENBQUE7QUFFakQsTUFBYSxnQkFBaUIsU0FBUSxLQUFLO0lBQ3hDLFlBQVksSUFBWTtRQUNyQixLQUFLLENBQUMsR0FBRyxJQUFJLGlFQUFpRSxDQUFDLENBQUE7SUFDbEYsQ0FBQztDQUNIO0FBSkQsNENBSUM7QUFFRDs7R0FFRztBQUNILE1BQWEsZ0JBQWdCO0lBZTFCLFlBQVksR0FBc0I7UUFDL0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFFZCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxFQUFvQixDQUFBO1FBRXpDLHFCQUFxQjtRQUNyQixLQUFJLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsRUFBRTtZQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxLQUFLLEVBQVUsQ0FBQyxDQUFBO1NBQzlDO0lBQ0osQ0FBQztJQXZCRCxJQUFJLE9BQU87UUFDUixLQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDbkMsSUFBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDakIsT0FBTyxLQUFLLENBQUE7YUFDZDtTQUNIO1FBRUQsT0FBTyxJQUFJLENBQUE7SUFDZCxDQUFDO0lBaUJELGdCQUFnQixDQUFDLEdBQVc7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LEdBQXNCO1FBQzlCLE9BQU8sQ0FBQyxLQUFVLEVBQVcsRUFBRTtZQUM1QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUN4QyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUE7UUFDeEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNIO0FBbkhELDRCQW1IQyIsInNvdXJjZXNDb250ZW50IjpbInR5cGUgVmFsaWRhdGVUeXBlSGFuZGxlciA9ICh2YWx1ZTogYW55KSA9PiBib29sZWFuXG5cbmV4cG9ydCB0eXBlIEtleVZhbHVlVHlwZSA9IHtcbiAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IFZhbGlkYXRlVHlwZUhhbmRsZXJcbn1cblxuZXhwb3J0IHR5cGUgT2JqZWN0VmFsaWRhdGVNYXAgPSB7XG4gICByZXF1aXJlZD86IEtleVZhbHVlVHlwZSxcbiAgIG9wdGlvbmFsPzogS2V5VmFsdWVUeXBlLFxuICAgbXV0ZXg/OiBLZXlWYWx1ZVR5cGVbXVxufVxuXG5lbnVtIFZhbGlkYXRlRmFpbFJlYXNvbiB7XG4gICBOb3RGb3VuZCA9ICdub3QtZm91bmQnLFxuICAgV3JvbmdUeXBlID0gJ3dyb25nLXR5cGUnLFxuICAgTXV0ZXhEdXBsaWNhdGUgPSAnbXV0ZXgtZHVwbGljYXRlJ1xufVxuXG4vLyBPcHRpbWl6YXRpb24gZm9yIHByZWNvbXBpbGVkIFJlZ2V4XG5jb25zdCBOYW1lVmFsaWRhdGlkYXRpb25SZWdleCA9IC9bXmEtekEtWjAtOS1fXS9nXG5cbmV4cG9ydCBjbGFzcyBJbnZhbGlkTmFtZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgICBzdXBlcihgJHtuYW1lfSBpcyBub3QgYSB2YWxpZCBuYW1lLiBJdCBtdXN0IG1hdGNoIHRoZSByZWdleCAvW15hLXpBLVowLTktX10vZ2ApXG4gICB9XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgcmVzdWx0cyBvZiBhIHZhbGlkYXRpb24gcnVuXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uUmVzdWx0IHtcbiAgIGdldCBzdWNjZXNzKCk6IGJvb2xlYW4ge1xuICAgICAgZm9yKGxldCBsaXN0IG9mIHRoaXMuZXJyb3JzLnZhbHVlcygpKSB7XG4gICAgICAgICBpZihsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgfVxuXG4gICByZWFkb25seSBtYXA6IE9iamVjdFZhbGlkYXRlTWFwXG5cbiAgIHByaXZhdGUgZXJyb3JzOiBNYXA8c3RyaW5nLCBzdHJpbmdbXT5cbiAgIFxuICAgY29uc3RydWN0b3IobWFwOiBPYmplY3RWYWxpZGF0ZU1hcCkge1xuICAgICAgdGhpcy5tYXAgPSBtYXBcblxuICAgICAgdGhpcy5lcnJvcnMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nW10+KClcblxuICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgTWFwXG4gICAgICBmb3IobGV0IHJlYXNvbiBvZiBPYmplY3QudmFsdWVzKFZhbGlkYXRlRmFpbFJlYXNvbikpIHtcbiAgICAgICAgIHRoaXMuZXJyb3JzLnNldChyZWFzb24sIG5ldyBBcnJheTxzdHJpbmc+KCkpXG4gICAgICB9XG4gICB9XG5cbiAgIHJlcXVpcmVkTm90Rm91bmQoa2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIGxldCBrZXlzID0gdGhpcy5lcnJvcnMuZ2V0KFZhbGlkYXRlRmFpbFJlYXNvbi5Ob3RGb3VuZClcbiAgICAgIGtleXM/LnB1c2goa2V5KVxuICAgfVxuXG4gICByZXF1aXJlZEZhaWxlZFZhbGlkYXRpb24oa2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIGxldCBrZXlzID0gdGhpcy5lcnJvcnMuZ2V0KFZhbGlkYXRlRmFpbFJlYXNvbi5Xcm9uZ1R5cGUpXG4gICAgICBrZXlzPy5wdXNoKGtleSlcbiAgIH1cblxuICAgcmVxdWlyZWRXcm9uZ1R5cGUoa2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIGxldCBrZXlzID0gdGhpcy5lcnJvcnMuZ2V0KFZhbGlkYXRlRmFpbFJlYXNvbi5Xcm9uZ1R5cGUpXG4gICAgICBrZXlzPy5wdXNoKGtleSlcbiAgIH1cblxuICAgbXV0ZXhEdXBsaWNhdGUoa2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIGxldCBrZXlzID0gdGhpcy5lcnJvcnMuZ2V0KFZhbGlkYXRlRmFpbFJlYXNvbi5NdXRleER1cGxpY2F0ZSlcbiAgICAgIGtleXM/LnB1c2goa2V5KVxuICAgfVxuXG4gICBleHBlY3QoKTogc3RyaW5nIHtcbiAgICAgIGxldCByZXN1bHRzID0gYGBcblxuICAgICAgaWYodGhpcy5tYXAucmVxdWlyZWQgIT0gbnVsbCkge1xuICAgICAgICAgcmVzdWx0cyArPSBgVGhlIHJlcXVpcmVkIGZpZWxkczogYCBcbiAgICAgICAgIFxuICAgICAgICAgbGV0IGNvdW50ID0gMFxuICAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5tYXAucmVxdWlyZWQpKSB7XG4gICAgICAgICAgICByZXN1bHRzICs9IGAke2NvdW50KysgPiAwID8gJywgJyA6ICcnfSR7a2V5fWBcbiAgICAgICAgIH1cblxuICAgICAgICAgcmVzdWx0cyArPSAnLiAnXG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMubWFwLm9wdGlvbmFsICE9IG51bGwpIHtcbiAgICAgICAgIHJlc3VsdHMgKz0gYFRoZSBvcHRpb25hbCBmaWVsZHM6IGBcblxuICAgICAgICAgbGV0IGNvdW50ID0gMFxuICAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5tYXAub3B0aW9uYWwpKSB7XG4gICAgICAgICAgICByZXN1bHRzICs9IGAke2NvdW50KysgPiAwID8gJywgJyA6ICcnfSR7a2V5fWBcbiAgICAgICAgIH1cblxuICAgICAgICAgcmVzdWx0cyArPSAnLiAnXG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMubWFwLm11dGV4ICE9IG51bGwpIHtcbiAgICAgICAgIHJlc3VsdHMgKz0gYFRoZSBtdXR1YWxseSBleGNsdXNpdmUgZmllbGRzOiBgXG5cbiAgICAgICAgIGZvcihsZXQgbXV0ZXggb2YgdGhpcy5tYXAubXV0ZXgpIHtcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IG5ldyBBcnJheTxzdHJpbmc+KClcbiAgICAgICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKG11dGV4KSkge1xuICAgICAgICAgICAgICAgZm91bmQucHVzaChrZXkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdHMgKz0gYFske2ZvdW5kLmpvaW4oJywnKX1dIGBcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhbGlkYXRlIHtcbiAgIHN0YXRpYyByZXNvdXJjZU5hbWUobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICBpZihuYW1lID09IG51bGwpIHtcbiAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkTmFtZUVycm9yKG5hbWUpXG4gICAgICB9XG5cbiAgICAgIGlmKG5hbWUgPT0gbnVsbCB8fCBOYW1lVmFsaWRhdGlkYXRpb25SZWdleC50ZXN0KG5hbWUpKSB7XG4gICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE5hbWVFcnJvcihuYW1lKVxuICAgICAgfVxuICAgfVxuXG4gICAvKipcbiAgICAqIFZhbGlkYXRlcyBhbiBPYmplY3RcbiAgICAqIFxuICAgICogRXhhbXBsZSB1c2FnZTpcbiAgICAqIFxuICAgICogICAgVmFsaWRhdGUub2JqZWN0KG9iaiwge1xuICAgICogICAgICAgcmVxdWlyZWQ6IHtcbiAgICAqICAgICAgICAgIHNvbWU6ICdzdHJpbmcnXG4gICAgKiAgICAgICAgICBjb3VudDogJ251bWJuZXInLFxuICAgICogICAgICAgICAgc3BlY2lhbDogKHZhbHVlKSA9PiB7XG4gICAgKiAgICAgICAgICAgICAvLyByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdmFsaWQsIG90aGVyd2lzZSBmYWxzZVxuICAgICogICAgICAgICAgfVxuICAgICogICAgICAgfSxcbiAgICAqICAgICAgIC8vIFdlIGlnbm9yZSBvcHRpb25hbCB2YWx1ZXMsIGJ1dCB3ZSBkZWNsYXJlIHRoZW0gc28gd2UgY2FuIGluY2x1ZGVcbiAgICAqICAgICAgIC8vIHRoZW0gaW4gYW55IGVycm9yIG1lc3NhZ2VzLiBUaGlzIGhlbHBzIGluZm9ybSB0aGUgdXNlci5cbiAgICAqICAgICAgIG9wdGlvbmFsOiB7XG4gICAgKiAgICAgICAgICBvcHRpb25hbDogJ3N0cmluZycsXG4gICAgKiAgICAgICAgICBkb250bmVlZG1lOiAnbnVtYmVyJ1xuICAgICogICAgICAgfSxcbiAgICAqICAgICAgIC8vIE11dHVhbGx5IGV4Y2x1c2l2ZSBwcm9wZXJ0aWVzXG4gICAgKiAgICAgICBtdXRleDogW1xuICAgICogICAgICAgICAge1xuICAgICogICAgICAgICAgICAgc291cmNlUGF0aDogJ3N0cmluZycsXG4gICAgKiAgICAgICAgICAgICBzb3VyY2VJZDogJ3N0cmluZydcbiAgICAqICAgICAgICAgIH0sXG4gICAgKiAgICAgICAgICB7XG4gICAgKiAgICAgICAgICAgICBwYXJlbnRQYXRoOiAnc3RyaW5nJyxcbiAgICAqICAgICAgICAgICAgIHBhcmVudElkOiAnc3RyaW5nJ1xuICAgICogICAgICAgICAgfVxuICAgICogICAgICAgXVxuICAgICogICAgIH0pXG4gICAgKiBcbiAgICAqIEBwYXJhbSBvYmogVGhlIE9iamVjdCB0byB2YWxpZGF0ZVxuICAgICogQHBhcmFtIG1hcCBUaGUgdmFsaWRhdHJpb24gbWFwIGNvbnRhaW5pbmcgdGhlIGV4cGVjdGVkIHN0cnVjdHVyZVxuICAgICovXG4gICBzdGF0aWMgb2JqZWN0KG9iajogYW55LCBtYXA6IE9iamVjdFZhbGlkYXRlTWFwKTogVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgICBsZXQgcmVzdWx0ID0gbmV3IFZhbGlkYXRpb25SZXN1bHQobWFwKVxuXG4gICAgICBsZXQgdGVzdFR5cGUgPSAoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHR5cGU6IHN0cmluZyB8IFZhbGlkYXRlVHlwZUhhbmRsZXIpOiB2b2lkID0+IHtcbiAgICAgICAgIGlmKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBpZighdHlwZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgIHJlc3VsdC5yZXF1aXJlZEZhaWxlZFZhbGlkYXRpb24oa2V5KVxuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gdHlwZSkge1xuICAgICAgICAgICAgcmVzdWx0LnJlcXVpcmVkV3JvbmdUeXBlKGtleSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZihtYXAucmVxdWlyZWQgIT0gbnVsbCkge1xuICAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMobWFwLnJlcXVpcmVkKSkge1xuICAgICAgICAgICAgaWYgKG9ialtrZXldID09IG51bGwpIHtcbiAgICAgICAgICAgICAgIHJlc3VsdC5yZXF1aXJlZE5vdEZvdW5kKGtleSlcbiAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRlc3RUeXBlKGtleSwgb2JqW2tleV0sIG1hcC5yZXF1aXJlZFtrZXldKVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZihtYXAubXV0ZXggIT0gbnVsbCkge1xuICAgICAgICAgZm9yKGxldCBtdXRleCBvZiBtYXAubXV0ZXgpIHtcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IG5ldyBBcnJheTxzdHJpbmc+KClcblxuICAgICAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMobXV0ZXgpKSB7XG4gICAgICAgICAgICAgICBpZihvYmpba2V5XSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBmb3VuZC5wdXNoKGtleSlcbiAgICAgICAgICAgICAgICAgIHRlc3RUeXBlKGtleSwgb2JqW2tleV0sIG11dGV4W2tleV0pXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGZvdW5kLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgIGZvdW5kLmZvckVhY2goayA9PiByZXN1bHQubXV0ZXhEdXBsaWNhdGUoaykpXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRcbiAgIH1cblxuICAgc3RhdGljIGVudW0oZW5tOiBhbnkpOiBWYWxpZGF0ZVR5cGVIYW5kbGVyIHtcbiAgICAgIHJldHVybiAodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgZm9yKGxldCBlbnVtVmFsdWUgb2YgT2JqZWN0LnZhbHVlcyhlbm0pKSB7XG4gICAgICAgICAgICBpZih2YWx1ZSA9PT0gZW51bVZhbHVlKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgXG4gICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGVzIGEgbWV0aG9kIHRvIHZhbGlkYXRlIGEgbmVzdGVkIG9iamVjdFxuICAgICogXG4gICAgKiBAcGFyYW0gbWFwIFRoZSBWYWxpZGF0aW9uIE1hcFxuICAgICovXG4gICBzdGF0aWMgb2JqKG1hcDogT2JqZWN0VmFsaWRhdGVNYXApOiBWYWxpZGF0ZVR5cGVIYW5kbGVyIHtcbiAgICAgIHJldHVybiAodmFsdWU6IGFueSk6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgbGV0IHJlc3VsdCA9IFZhbGlkYXRlLm9iamVjdCh2YWx1ZSwgbWFwKVxuICAgICAgICAgcmV0dXJuIHJlc3VsdC5zdWNjZXNzXG4gICAgICB9XG4gICB9XG59Il19