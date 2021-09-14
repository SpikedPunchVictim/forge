"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = void 0;
const Utils_1 = require("../utils/Utils");
class Step {
    constructor(info, plugin, use) {
        this.info = info;
        this.plugin = plugin;
        if (!Array.isArray(use)) {
            use = [use];
        }
        this.use = use;
    }
    get alias() {
        return this.info.alias;
    }
    /**
     * Ensures that the StepInfo contains the expected structure. Throws
     * an Error if it doesn't.
     *
     * @param info The info object
     */
    static validate(info) {
        if (!Utils_1.isDefined(info.alias)) {
            throw new Error(`Expected Step to include an alias. None was provided.`);
        }
        if (!Utils_1.isDefined(info.plugin)) {
            throw new Error(`Expected Step to include an plugin. None was provided.`);
        }
    }
}
exports.Step = Step;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RlcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL1N0ZXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMENBQTJDO0FBZTNDLE1BQWEsSUFBSTtJQVdkLFlBQVksSUFBYyxFQUFFLE1BQWUsRUFBRSxHQUFzQjtRQUNoRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUVwQixJQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBQztZQUNwQixHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUNiO1FBRUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7SUFDakIsQ0FBQztJQWpCRCxJQUFJLEtBQUs7UUFDTixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFBO0lBQ3pCLENBQUM7SUFpQkQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQWM7UUFDM0IsSUFBRyxDQUFDLGlCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQTtTQUMxRTtRQUVELElBQUcsQ0FBQyxpQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHdEQUF3RCxDQUFDLENBQUE7U0FDM0U7SUFDSixDQUFDO0NBQ0g7QUFyQ0Qsb0JBcUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVBsdWdpbiB9IGZyb20gXCIuLi9wbHVnaW5zL0lQbHVnaW5cIjtcbmltcG9ydCB7IGlzRGVmaW5lZCB9IGZyb20gXCIuLi91dGlscy9VdGlsc1wiO1xuXG5leHBvcnQgdHlwZSBTdGVwSW5mbyA9IHtcbiAgIGFsaWFzOiBzdHJpbmdcbiAgIHBsdWdpbjogc3RyaW5nXG4gICBba2V5OiBzdHJpbmddOiBhbnlcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJU3RlcCB7XG4gICBhbGlhczogc3RyaW5nXG4gICBwbHVnaW46IElQbHVnaW5cbiAgIHJlYWRvbmx5IHVzZTogQXJyYXk8c3RyaW5nPlxuICAgaW5mbzogU3RlcEluZm9cbn1cblxuZXhwb3J0IGNsYXNzIFN0ZXAgaW1wbGVtZW50cyBJU3RlcCB7XG4gICByZWFkb25seSBwbHVnaW46IElQbHVnaW5cblxuICAgZ2V0IGFsaWFzKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gdGhpcy5pbmZvLmFsaWFzXG4gICB9XG5cbiAgIHJlYWRvbmx5IHVzZTogQXJyYXk8c3RyaW5nPlxuXG4gICByZWFkb25seSBpbmZvOiBTdGVwSW5mb1xuXG4gICBjb25zdHJ1Y3RvcihpbmZvOiBTdGVwSW5mbywgcGx1Z2luOiBJUGx1Z2luLCB1c2U6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICB0aGlzLmluZm8gPSBpbmZvXG4gICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpblxuXG4gICAgICBpZighQXJyYXkuaXNBcnJheSh1c2UpKXtcbiAgICAgICAgIHVzZSA9IFt1c2VdXG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMudXNlID0gdXNlXG4gICB9XG5cbiAgIC8qKlxuICAgICogRW5zdXJlcyB0aGF0IHRoZSBTdGVwSW5mbyBjb250YWlucyB0aGUgZXhwZWN0ZWQgc3RydWN0dXJlLiBUaHJvd3NcbiAgICAqIGFuIEVycm9yIGlmIGl0IGRvZXNuJ3QuXG4gICAgKiBcbiAgICAqIEBwYXJhbSBpbmZvIFRoZSBpbmZvIG9iamVjdFxuICAgICovXG4gICBzdGF0aWMgdmFsaWRhdGUoaW5mbzogU3RlcEluZm8pOiB2b2lkIHtcbiAgICAgIGlmKCFpc0RlZmluZWQoaW5mby5hbGlhcykpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgU3RlcCB0byBpbmNsdWRlIGFuIGFsaWFzLiBOb25lIHdhcyBwcm92aWRlZC5gKVxuICAgICAgfVxuXG4gICAgICBpZighaXNEZWZpbmVkKGluZm8ucGx1Z2luKSkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBTdGVwIHRvIGluY2x1ZGUgYW4gcGx1Z2luLiBOb25lIHdhcyBwcm92aWRlZC5gKVxuICAgICAgfVxuICAgfVxufSJdfQ==