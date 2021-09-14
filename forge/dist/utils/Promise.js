"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequence = exports.defer = void 0;
/*------------------------------------------------------------------------
 * Creates a deferred promise.
 *
 * Note:
 *    This is used in situations when creating user facing methods, want
 *    defer the running of a custom function (ie apply()), or memoization.
 /*---------------------------------------------------------------------*/
function defer() {
    let defer = {};
    defer.promise = new Promise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}
exports.defer = defer;
/*------------------------------------------------------------------------
 * Runs a series of promises in sequence
 *
 * @param {Array|function():Promise} promises
 *    An Array of parameterless methods that return Promises will be run in sequence
 /*---------------------------------------------------------------------*/
function sequence(promises /*| () => Promise<any>*/) {
    if (promises == null) {
        return Promise.resolve();
    }
    // if(!Array.isArray(promises)) {
    //    return Promise.resolve(promises)
    //       .then(value => value)
    // }
    return promises.reduce((p, curr) => {
        return p.then(_ => curr());
    }, Promise.resolve());
}
exports.sequence = sequence;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9Qcm9taXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQU1BOzs7Ozs7MEVBTTBFO0FBQ3pFLFNBQWdCLEtBQUs7SUFDbkIsSUFBSSxLQUFLLEdBQUcsRUFBZSxDQUFBO0lBRTNCLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDaEQsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdkIsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7SUFDeEIsQ0FBQyxDQUFDLENBQUE7SUFFRixPQUFPLEtBQUssQ0FBQTtBQUNmLENBQUM7QUFUQSxzQkFTQTtBQUVEOzs7OzswRUFLMEU7QUFDekUsU0FBZ0IsUUFBUSxDQUFDLFFBQW1DLENBQUMsd0JBQXdCO0lBQ25GLElBQUcsUUFBUSxJQUFJLElBQUksRUFBRTtRQUNsQixPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUMxQjtJQUVELGlDQUFpQztJQUNqQyxzQ0FBc0M7SUFDdEMsOEJBQThCO0lBQzlCLElBQUk7SUFFSixPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDaEMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUM3QixDQUFDLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7QUFDeEIsQ0FBQztBQWJBLDRCQWFBIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJRGVmZXI8VD4ge1xuICAgcHJvbWlzZTogUHJvbWlzZTxUPlxuICAgcmVzb2x2ZTogKHZhbHVlPzogVCB8IFByb21pc2VMaWtlPFQ+IHwgdW5kZWZpbmVkKSA9PiB2b2lkXG4gICByZWplY3Q6IChlcnI6IEVycm9yKSA9PiB2b2lkXG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDcmVhdGVzIGEgZGVmZXJyZWQgcHJvbWlzZS5cbiAqXG4gKiBOb3RlOlxuICogICAgVGhpcyBpcyB1c2VkIGluIHNpdHVhdGlvbnMgd2hlbiBjcmVhdGluZyB1c2VyIGZhY2luZyBtZXRob2RzLCB3YW50XG4gKiAgICBkZWZlciB0aGUgcnVubmluZyBvZiBhIGN1c3RvbSBmdW5jdGlvbiAoaWUgYXBwbHkoKSksIG9yIG1lbW9pemF0aW9uLlxuIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiBleHBvcnQgZnVuY3Rpb24gZGVmZXI8VD4oKTogSURlZmVyPFQ+IHtcbiAgIGxldCBkZWZlciA9IHt9IGFzIElEZWZlcjxUPlxuXG4gICBkZWZlci5wcm9taXNlID0gbmV3IFByb21pc2U8VD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZGVmZXIucmVzb2x2ZSA9IHJlc29sdmVcbiAgICAgIGRlZmVyLnJlamVjdCA9IHJlamVjdFxuICAgfSlcblxuICAgcmV0dXJuIGRlZmVyXG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBSdW5zIGEgc2VyaWVzIG9mIHByb21pc2VzIGluIHNlcXVlbmNlXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl8ZnVuY3Rpb24oKTpQcm9taXNlfSBwcm9taXNlc1xuICogICAgQW4gQXJyYXkgb2YgcGFyYW1ldGVybGVzcyBtZXRob2RzIHRoYXQgcmV0dXJuIFByb21pc2VzIHdpbGwgYmUgcnVuIGluIHNlcXVlbmNlXG4gLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuIGV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZShwcm9taXNlczogQXJyYXk8KCkgPT4gUHJvbWlzZTxhbnk+PiAvKnwgKCkgPT4gUHJvbWlzZTxhbnk+Ki8pIHtcbiAgIGlmKHByb21pc2VzID09IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgfVxuXG4gICAvLyBpZighQXJyYXkuaXNBcnJheShwcm9taXNlcykpIHtcbiAgIC8vICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocHJvbWlzZXMpXG4gICAvLyAgICAgICAudGhlbih2YWx1ZSA9PiB2YWx1ZSlcbiAgIC8vIH1cblxuICAgcmV0dXJuIHByb21pc2VzLnJlZHVjZSgocCwgY3VycikgPT4ge1xuICAgICAgcmV0dXJuIHAudGhlbihfID0+IGN1cnIoKSlcbiAgIH0sIFByb21pc2UucmVzb2x2ZSgpKVxufVxuXG4iXX0=