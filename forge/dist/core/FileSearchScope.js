"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSearchScope = void 0;
const path = require('path');
const fs = require("fs-extra");
const globby = require('globby');
/**
 * Contains the logic to resolve file paths
 */
class FileSearchScope {
    constructor(dirs = new Array()) {
        this.dirs = dirs;
        this._merged = [];
    }
    /*---------------------------------------------------------------------
     * Searches for the existence of a file at the provided relative path
     *
     * @param {string} relativePath The relative path to search for
     * @returns string The absolute path of the first file found
     *-------------------------------------------------------------------*/
    async find(relativePath) {
        for (let dir of this.dirs) {
            let filePath = path.join(dir, relativePath);
            let stat = undefined;
            try {
                stat = await fs.stat(filePath);
            }
            catch (ex) {
                continue;
            }
            if (stat == null) {
                continue;
            }
            if (stat.isFile()) {
                return filePath;
            }
        }
        for (let scope of this._merged) {
            let found = await scope.find(relativePath);
            if (found !== undefined) {
                return found;
            }
        }
        return undefined;
    }
    /**
     * Searches for files matching a globbed pattern. A non-globbed
     * file path can also be used.
     *
     * @param relativeGlobPath A relative path that may or may not contain a globbed pattern
     * @param defaultResult Default value should a value not be found
     */
    async findGlob(relativeGlobPath, defaultResult = new Array()) {
        if (globby.hasMagic(relativeGlobPath)) {
            for (let dir of this.dirs) {
                let globbed = await globby(path.join(dir, relativeGlobPath));
                if (globbed.length > 0) {
                    return globbed;
                }
            }
        }
        else {
            let found = await this.find(relativeGlobPath);
            if (found) {
                return [found];
            }
        }
        return defaultResult;
    }
    /*---------------------------------------------------------------------
     * Adds a directory to the search scope
     *
     * @param {Array | string} dir Directory(ies) to add to the search scope
     *-------------------------------------------------------------------*/
    add(dir) {
        let addOne = p => {
            let found = this.dirs.indexOf(p);
            if (found < 0) {
                this.dirs.push(p);
            }
        };
        if (typeof dir === 'string') {
            addOne(dir);
        }
        else if (Array.isArray(dir)) {
            dir.forEach(d => addOne(d));
        }
    }
    /*---------------------------------------------------------------------
     * Merges another FileResolver with this one. It will be used
     * when finding files
     *
     * @param {FileResolver} fileResolver
     *-------------------------------------------------------------------*/
    merge(scope) {
        if (this._merged.indexOf(scope) >= 0) {
            return;
        }
        this._merged.push(scope);
    }
}
exports.FileSearchScope = FileSearchScope;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZVNlYXJjaFNjb3BlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvRmlsZVNlYXJjaFNjb3BlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1QiwrQkFBOEI7QUFDOUIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBRWhDOztHQUVHO0FBQ0gsTUFBYSxlQUFlO0lBSXpCLFlBQVksT0FBc0IsSUFBSSxLQUFLLEVBQVU7UUFDbEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7SUFDcEIsQ0FBQztJQUVEOzs7OzsyRUFLdUU7SUFDdkUsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFvQjtRQUM1QixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDeEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUE7WUFDM0MsSUFBSSxJQUFJLEdBQXlCLFNBQVMsQ0FBQTtZQUUxQyxJQUFJO2dCQUNELElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7YUFDaEM7WUFBQyxPQUFPLEVBQUUsRUFBRTtnQkFDVixTQUFRO2FBQ1Y7WUFFRCxJQUFHLElBQUksSUFBSSxJQUFJLEVBQUU7Z0JBQ2QsU0FBUTthQUNWO1lBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2hCLE9BQU8sUUFBUSxDQUFBO2FBQ2pCO1NBQ0g7UUFFRCxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDN0IsSUFBSSxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBRTFDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDdEIsT0FBTyxLQUFLLENBQUE7YUFDZDtTQUNIO1FBRUQsT0FBTyxTQUFTLENBQUE7SUFDbkIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQXdCLEVBQUUsZ0JBQTBCLElBQUksS0FBSyxFQUFVO1FBQ25GLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3BDLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDeEIsSUFBSSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO2dCQUU1RCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNyQixPQUFPLE9BQU8sQ0FBQTtpQkFDaEI7YUFDSDtTQUNIO2FBQU07WUFDSixJQUFJLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUU3QyxJQUFHLEtBQUssRUFBRTtnQkFDUCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDaEI7U0FDSDtRQUVELE9BQU8sYUFBYSxDQUFBO0lBQ3ZCLENBQUM7SUFFRDs7OzsyRUFJdUU7SUFDdkUsR0FBRyxDQUFDLEdBQTJCO1FBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ2QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFaEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO2dCQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ25CO1FBQ0osQ0FBQyxDQUFBO1FBRUQsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7WUFDMUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQ2I7YUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDNUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQzdCO0lBQ0osQ0FBQztJQUVEOzs7OzsyRUFLdUU7SUFDdkUsS0FBSyxDQUFDLEtBQXNCO1FBQ3pCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25DLE9BQU07U0FDUjtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzNCLENBQUM7Q0FDSDtBQTNHRCwwQ0EyR0MiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSdcbmNvbnN0IGdsb2JieSA9IHJlcXVpcmUoJ2dsb2JieScpXG5cbi8qKlxuICogQ29udGFpbnMgdGhlIGxvZ2ljIHRvIHJlc29sdmUgZmlsZSBwYXRoc1xuICovXG5leHBvcnQgY2xhc3MgRmlsZVNlYXJjaFNjb3BlIHtcbiAgIHJlYWRvbmx5IGRpcnM6IEFycmF5PHN0cmluZz5cbiAgIHByaXZhdGUgX21lcmdlZDogQXJyYXk8RmlsZVNlYXJjaFNjb3BlPlxuXG4gICBjb25zdHJ1Y3RvcihkaXJzOiBBcnJheTxzdHJpbmc+ID0gbmV3IEFycmF5PHN0cmluZz4oKSkge1xuICAgICAgdGhpcy5kaXJzID0gZGlyc1xuICAgICAgdGhpcy5fbWVyZ2VkID0gW11cbiAgIH1cblxuICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAqIFNlYXJjaGVzIGZvciB0aGUgZXhpc3RlbmNlIG9mIGEgZmlsZSBhdCB0aGUgcHJvdmlkZWQgcmVsYXRpdmUgcGF0aFxuICAgICpcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVBhdGggVGhlIHJlbGF0aXZlIHBhdGggdG8gc2VhcmNoIGZvclxuICAgICogQHJldHVybnMgc3RyaW5nIFRoZSBhYnNvbHV0ZSBwYXRoIG9mIHRoZSBmaXJzdCBmaWxlIGZvdW5kXG4gICAgKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgYXN5bmMgZmluZChyZWxhdGl2ZVBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XG4gICAgICBmb3IgKGxldCBkaXIgb2YgdGhpcy5kaXJzKSB7XG4gICAgICAgICBsZXQgZmlsZVBhdGggPSBwYXRoLmpvaW4oZGlyLCByZWxhdGl2ZVBhdGgpXG4gICAgICAgICBsZXQgc3RhdDogZnMuU3RhdHMgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcblxuICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHN0YXQgPSBhd2FpdCBmcy5zdGF0KGZpbGVQYXRoKVxuICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmKHN0YXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYgKHN0YXQuaXNGaWxlKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlUGF0aFxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBzY29wZSBvZiB0aGlzLl9tZXJnZWQpIHtcbiAgICAgICAgIGxldCBmb3VuZCA9IGF3YWl0IHNjb3BlLmZpbmQocmVsYXRpdmVQYXRoKVxuXG4gICAgICAgICBpZiAoZm91bmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZvdW5kXG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgIH1cblxuICAgLyoqXG4gICAgKiBTZWFyY2hlcyBmb3IgZmlsZXMgbWF0Y2hpbmcgYSBnbG9iYmVkIHBhdHRlcm4uIEEgbm9uLWdsb2JiZWRcbiAgICAqIGZpbGUgcGF0aCBjYW4gYWxzbyBiZSB1c2VkLlxuICAgICogXG4gICAgKiBAcGFyYW0gcmVsYXRpdmVHbG9iUGF0aCBBIHJlbGF0aXZlIHBhdGggdGhhdCBtYXkgb3IgbWF5IG5vdCBjb250YWluIGEgZ2xvYmJlZCBwYXR0ZXJuXG4gICAgKiBAcGFyYW0gZGVmYXVsdFJlc3VsdCBEZWZhdWx0IHZhbHVlIHNob3VsZCBhIHZhbHVlIG5vdCBiZSBmb3VuZFxuICAgICovXG4gICBhc3luYyBmaW5kR2xvYihyZWxhdGl2ZUdsb2JQYXRoOiBzdHJpbmcsIGRlZmF1bHRSZXN1bHQ6IHN0cmluZ1tdID0gbmV3IEFycmF5PHN0cmluZz4oKSk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICAgIGlmIChnbG9iYnkuaGFzTWFnaWMocmVsYXRpdmVHbG9iUGF0aCkpIHtcbiAgICAgICAgIGZvciAobGV0IGRpciBvZiB0aGlzLmRpcnMpIHtcbiAgICAgICAgICAgIGxldCBnbG9iYmVkID0gYXdhaXQgZ2xvYmJ5KHBhdGguam9pbihkaXIsIHJlbGF0aXZlR2xvYlBhdGgpKVxuXG4gICAgICAgICAgICBpZiAoZ2xvYmJlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gZ2xvYmJlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGxldCBmb3VuZCA9IGF3YWl0IHRoaXMuZmluZChyZWxhdGl2ZUdsb2JQYXRoKVxuXG4gICAgICAgICBpZihmb3VuZCkge1xuICAgICAgICAgICAgcmV0dXJuIFtmb3VuZF1cbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlZmF1bHRSZXN1bHRcbiAgIH1cblxuICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAqIEFkZHMgYSBkaXJlY3RvcnkgdG8gdGhlIHNlYXJjaCBzY29wZVxuICAgICpcbiAgICAqIEBwYXJhbSB7QXJyYXkgfCBzdHJpbmd9IGRpciBEaXJlY3RvcnkoaWVzKSB0byBhZGQgdG8gdGhlIHNlYXJjaCBzY29wZVxuICAgICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgIGFkZChkaXI6IHN0cmluZyB8IEFycmF5PHN0cmluZz4pOiB2b2lkIHtcbiAgICAgIGxldCBhZGRPbmUgPSBwID0+IHtcbiAgICAgICAgIGxldCBmb3VuZCA9IHRoaXMuZGlycy5pbmRleE9mKHApXG5cbiAgICAgICAgIGlmIChmb3VuZCA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGlycy5wdXNoKHApXG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgZGlyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgYWRkT25lKGRpcilcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkaXIpKSB7XG4gICAgICAgICBkaXIuZm9yRWFjaChkID0+IGFkZE9uZShkKSlcbiAgICAgIH1cbiAgIH1cblxuICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAqIE1lcmdlcyBhbm90aGVyIEZpbGVSZXNvbHZlciB3aXRoIHRoaXMgb25lLiBJdCB3aWxsIGJlIHVzZWRcbiAgICAqIHdoZW4gZmluZGluZyBmaWxlc1xuICAgICpcbiAgICAqIEBwYXJhbSB7RmlsZVJlc29sdmVyfSBmaWxlUmVzb2x2ZXIgXG4gICAgKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgbWVyZ2Uoc2NvcGU6IEZpbGVTZWFyY2hTY29wZSk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuX21lcmdlZC5pbmRleE9mKHNjb3BlKSA+PSAwKSB7XG4gICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5fbWVyZ2VkLnB1c2goc2NvcGUpXG4gICB9XG59Il19