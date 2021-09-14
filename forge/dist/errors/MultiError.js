"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiError = void 0;
class MultiError extends Error {
    constructor(errors) {
        super();
        this.errors = new Array();
        if (errors) {
            if (!Array.isArray(errors)) {
                errors = [errors];
            }
            this.errors = errors;
        }
    }
    get length() {
        return this.errors.length;
    }
    *[Symbol.iterator]() {
        for (const error of this.errors) {
            yield error;
        }
    }
}
exports.MultiError = MultiError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXVsdGlFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lcnJvcnMvTXVsdGlFcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLFVBQVcsU0FBUSxLQUFLO0lBT2xDLFlBQVksTUFBd0I7UUFDakMsS0FBSyxFQUFFLENBQUE7UUFQRCxXQUFNLEdBQVksSUFBSSxLQUFLLEVBQVMsQ0FBQTtRQVMxQyxJQUFHLE1BQU0sRUFBRTtZQUNSLElBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN4QixNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUNuQjtZQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1NBQ3RCO0lBQ0osQ0FBQztJQWRELElBQUksTUFBTTtRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUE7SUFDNUIsQ0FBQztJQWNELENBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQyxNQUFNLEtBQUssQ0FBQztTQUNaO0lBQ0YsQ0FBQztDQUNEO0FBeEJELGdDQXdCQyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5leHBvcnQgY2xhc3MgTXVsdGlFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgIHJlYWRvbmx5IGVycm9yczogRXJyb3JbXSA9IG5ldyBBcnJheTxFcnJvcj4oKVxuXG4gICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5lcnJvcnMubGVuZ3RoXG4gICB9XG5cbiAgIGNvbnN0cnVjdG9yKGVycm9ycz86IEVycm9yIHwgRXJyb3JbXSkge1xuICAgICAgc3VwZXIoKVxuXG4gICAgICBpZihlcnJvcnMpIHtcbiAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KGVycm9ycykpIHtcbiAgICAgICAgICAgIGVycm9ycyA9IFtlcnJvcnNdXG4gICAgICAgICB9XG4gICBcbiAgICAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzXG4gICAgICB9XG4gICB9XG5cbiAgICogW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG5cdFx0Zm9yIChjb25zdCBlcnJvciBvZiB0aGlzLmVycm9ycykge1xuXHRcdFx0eWllbGQgZXJyb3I7XG5cdFx0fVxuXHR9XG59Il19