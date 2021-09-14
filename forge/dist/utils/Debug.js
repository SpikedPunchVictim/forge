"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspect = exports.elapsedTime = void 0;
const util = require('util');
const Logger_1 = require("./Logger");
const logger = new Logger_1.ConsoleLogger();
/*------------------------------------------------------------------------
* Records the amount of time that has passed between calls. To use,
* call this method without any parameters, and record the key that
* is returned. At a later time, call this method again with the key
* that was returned previously, and a time span object will be returned.
*
* Example:
*  let key = elapsedTime();
*  ...
*  let span = elapsedTime(key);
*
* @param {string} key If not provided, will return a key.
* @return {IElapsedToken} If called with no parameters, a token
*     is returned, otherwise an time span object is returned
*     with the following properties:
*        {uint} s: seconds (the second portion only)
*        {uint} ms: milliseconds (the ms portion only)
*        {uint} totalMs: The total amount of time in milliseconds
/*------------------------------------------------------------------------*/
function elapsedTime(token) {
    if (token) {
        let result = process.hrtime(token.key);
        let seconds = result[0];
        let ms = result[1] / 1000000;
        return {
            key: token.key,
            seconds: seconds,
            ms: ms,
            totalMs: (seconds * 1000) + ms
        };
    }
    else {
        return {
            key: process.hrtime(),
            seconds: -1,
            ms: -1,
            totalMs: -1
        };
    }
}
exports.elapsedTime = elapsedTime;
/*-----------------------------------------------------------------------*
* Dump an object to stdout. This will display a name for each section
* with each object dump.
*
* @params {string} name The name of the section
* @params {Object} obj The object to dump
* @params {object} options
*        {boolean} alone If set, will remove all other stdout and only display the object
*        {boolean} showColors (default true) If set will add color to the printed results
/*------------------------------------------------------------------------*/
function inspect(name, obj, options) {
    let opts = options || {};
    opts.alone = opts.alone || false;
    opts.showColors = opts.showColors || true;
    if (opts.alone) {
        process.stdout.write("\x1B[2J");
    }
    if (typeof name === 'object') {
        obj = name;
        name = "Inspect";
    }
    logger.info('----------------------------------------------------');
    logger.info(':: ' + name);
    logger.info(util.inspect(obj, { showHidden: true, depth: null, colors: opts.showColors }));
    logger.info('----------------------------------------------------\n');
}
exports.inspect = inspect;
// export default {
//    inspect,
//    elapsedTime
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvRGVidWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzVCLHFDQUF3QztBQUV4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFhLEVBQUUsQ0FBQTtBQVNsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRFQWtCNEU7QUFDNUUsU0FBZ0IsV0FBVyxDQUFDLEtBQXFCO0lBQzlDLElBQUksS0FBSyxFQUFFO1FBQ1IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdEMsSUFBSSxPQUFPLEdBQVcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQy9CLElBQUksRUFBRSxHQUFXLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUE7UUFDcEMsT0FBTztZQUNKLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLEVBQUUsRUFBRSxFQUFFO1lBQ04sT0FBTyxFQUFFLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7U0FDZixDQUFBO0tBQ3BCO1NBQU07UUFDSixPQUFPO1lBQ0osR0FBRyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDckIsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNYLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDTixPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ0ksQ0FBQTtLQUNwQjtBQUNKLENBQUM7QUFuQkQsa0NBbUJDO0FBRUQ7Ozs7Ozs7Ozs0RUFTNEU7QUFDNUUsU0FBZ0IsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTztJQUN2QyxJQUFJLElBQUksR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7SUFDakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQztJQUUxQyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDYixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNsQztJQUVELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQzNCLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDWCxJQUFJLEdBQUcsU0FBUyxDQUFBO0tBQ2xCO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0lBQ3BFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0YsTUFBTSxDQUFDLElBQUksQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFsQkQsMEJBa0JDO0FBRUQsbUJBQW1CO0FBQ25CLGNBQWM7QUFDZCxpQkFBaUI7QUFDakIsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbmltcG9ydCB7IENvbnNvbGVMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcidcblxuY29uc3QgbG9nZ2VyID0gbmV3IENvbnNvbGVMb2dnZXIoKVxuXG5leHBvcnQgaW50ZXJmYWNlIElFbGFwc2VkVG9rZW4ge1xuICAga2V5OiBbbnVtYmVyLCBudW1iZXJdXG4gICBzZWNvbmRzOiBudW1iZXJcbiAgIG1zOiBudW1iZXJcbiAgIHRvdGFsTXM6IG51bWJlclxufVxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKiBSZWNvcmRzIHRoZSBhbW91bnQgb2YgdGltZSB0aGF0IGhhcyBwYXNzZWQgYmV0d2VlbiBjYWxscy4gVG8gdXNlLFxuKiBjYWxsIHRoaXMgbWV0aG9kIHdpdGhvdXQgYW55IHBhcmFtZXRlcnMsIGFuZCByZWNvcmQgdGhlIGtleSB0aGF0XG4qIGlzIHJldHVybmVkLiBBdCBhIGxhdGVyIHRpbWUsIGNhbGwgdGhpcyBtZXRob2QgYWdhaW4gd2l0aCB0aGUga2V5XG4qIHRoYXQgd2FzIHJldHVybmVkIHByZXZpb3VzbHksIGFuZCBhIHRpbWUgc3BhbiBvYmplY3Qgd2lsbCBiZSByZXR1cm5lZC5cbipcbiogRXhhbXBsZTpcbiogIGxldCBrZXkgPSBlbGFwc2VkVGltZSgpO1xuKiAgLi4uXG4qICBsZXQgc3BhbiA9IGVsYXBzZWRUaW1lKGtleSk7XG4qXG4qIEBwYXJhbSB7c3RyaW5nfSBrZXkgSWYgbm90IHByb3ZpZGVkLCB3aWxsIHJldHVybiBhIGtleS5cbiogQHJldHVybiB7SUVsYXBzZWRUb2tlbn0gSWYgY2FsbGVkIHdpdGggbm8gcGFyYW1ldGVycywgYSB0b2tlblxuKiAgICAgaXMgcmV0dXJuZWQsIG90aGVyd2lzZSBhbiB0aW1lIHNwYW4gb2JqZWN0IGlzIHJldHVybmVkXG4qICAgICB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiogICAgICAgIHt1aW50fSBzOiBzZWNvbmRzICh0aGUgc2Vjb25kIHBvcnRpb24gb25seSlcbiogICAgICAgIHt1aW50fSBtczogbWlsbGlzZWNvbmRzICh0aGUgbXMgcG9ydGlvbiBvbmx5KVxuKiAgICAgICAge3VpbnR9IHRvdGFsTXM6IFRoZSB0b3RhbCBhbW91bnQgb2YgdGltZSBpbiBtaWxsaXNlY29uZHMgICAgICAgICAgICAgICAgIFxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGZ1bmN0aW9uIGVsYXBzZWRUaW1lKHRva2VuPzogSUVsYXBzZWRUb2tlbik6IElFbGFwc2VkVG9rZW4ge1xuICAgaWYgKHRva2VuKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gcHJvY2Vzcy5ocnRpbWUodG9rZW4ua2V5KVxuICAgICAgbGV0IHNlY29uZHM6IG51bWJlciA9IHJlc3VsdFswXVxuICAgICAgbGV0IG1zOiBudW1iZXIgPSByZXN1bHRbMV0gLyAxMDAwMDAwXG4gICAgICByZXR1cm4ge1xuICAgICAgICAga2V5OiB0b2tlbi5rZXksXG4gICAgICAgICBzZWNvbmRzOiBzZWNvbmRzLFxuICAgICAgICAgbXM6IG1zLFxuICAgICAgICAgdG90YWxNczogKHNlY29uZHMgKiAxMDAwKSArIG1zXG4gICAgICB9IGFzIElFbGFwc2VkVG9rZW5cbiAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAga2V5OiBwcm9jZXNzLmhydGltZSgpLFxuICAgICAgICAgc2Vjb25kczogLTEsXG4gICAgICAgICBtczogLTEsXG4gICAgICAgICB0b3RhbE1zOiAtMVxuICAgICAgfSBhcyBJRWxhcHNlZFRva2VuXG4gICB9XG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qXG4qIER1bXAgYW4gb2JqZWN0IHRvIHN0ZG91dC4gVGhpcyB3aWxsIGRpc3BsYXkgYSBuYW1lIGZvciBlYWNoIHNlY3Rpb25cbiogd2l0aCBlYWNoIG9iamVjdCBkdW1wLlxuKlxuKiBAcGFyYW1zIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHNlY3Rpb25cbiogQHBhcmFtcyB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBkdW1wXG4qIEBwYXJhbXMge29iamVjdH0gb3B0aW9uc1xuKiAgICAgICAge2Jvb2xlYW59IGFsb25lIElmIHNldCwgd2lsbCByZW1vdmUgYWxsIG90aGVyIHN0ZG91dCBhbmQgb25seSBkaXNwbGF5IHRoZSBvYmplY3RcbiogICAgICAgIHtib29sZWFufSBzaG93Q29sb3JzIChkZWZhdWx0IHRydWUpIElmIHNldCB3aWxsIGFkZCBjb2xvciB0byB0aGUgcHJpbnRlZCByZXN1bHRzXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5leHBvcnQgZnVuY3Rpb24gaW5zcGVjdChuYW1lLCBvYmosIG9wdGlvbnMpIHtcbiAgIGxldCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgIG9wdHMuYWxvbmUgPSBvcHRzLmFsb25lIHx8IGZhbHNlO1xuICAgb3B0cy5zaG93Q29sb3JzID0gb3B0cy5zaG93Q29sb3JzIHx8IHRydWU7XG5cbiAgIGlmIChvcHRzLmFsb25lKSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShcIlxceDFCWzJKXCIpO1xuICAgfVxuXG4gICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBvYmogPSBuYW1lO1xuICAgICAgbmFtZSA9IFwiSW5zcGVjdFwiXG4gICB9XG5cbiAgIGxvZ2dlci5pbmZvKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gICBsb2dnZXIuaW5mbygnOjogJyArIG5hbWUpO1xuICAgbG9nZ2VyLmluZm8odXRpbC5pbnNwZWN0KG9iaiwgeyBzaG93SGlkZGVuOiB0cnVlLCBkZXB0aDogbnVsbCwgY29sb3JzOiBvcHRzLnNob3dDb2xvcnMgfSkpO1xuICAgbG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG4nKTtcbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQge1xuLy8gICAgaW5zcGVjdCxcbi8vICAgIGVsYXBzZWRUaW1lXG4vLyB9Il19