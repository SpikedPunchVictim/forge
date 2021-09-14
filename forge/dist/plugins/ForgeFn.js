"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeFn = void 0;
const readable_stream_1 = require("readable-stream");
async function NoOpWrite(chunk, encoding) {
    return chunk;
}
async function* NoOpRead(size) {
    yield;
}
class ForgeFnOptions {
    constructor() {
        this.fn = undefined;
        this.object = true;
    }
    /**
     * Normalizes the Step information into a ForgeFnOptions object.
     *
     * @param info The step info
     * @returns ForgeFnOptions
     */
    static fromStep(info) {
        /*
           {
              alias: '',
              plugin: ':fn',
              fn: async (chunk, encoding) => { },
              object?: boolean
           }
        */
        let options = new ForgeFnOptions();
        if (info.fn != null) {
            if (typeof info.fn !== 'function') {
                throw new Error(`Encountered the wrong type for an 'fn' property for a forge:fn step. Expected 'function', but received a ${typeof info.fn} instead`);
            }
            options.fn = info.fn;
        }
        options.object = info.object || true;
        return options;
    }
}
class ForgeFn {
    constructor() {
        this.name = ForgeFn.type;
    }
    createStream(step) {
        let options = ForgeFnOptions.fromStep(step.info);
        if (options.fn === undefined) {
            options.fn = NoOpWrite;
        }
        let streamOptions = step.info.streamOptions || {};
        streamOptions.objectMode = options.object;
        return new readable_stream_1.Transform({
            async transform(chunk, encoding, callback) {
                if (options.fn == null) {
                    return callback();
                }
                try {
                    callback(undefined, await options.fn(chunk, encoding));
                }
                catch (err) {
                    callback(err);
                }
            },
            ...streamOptions
        });
    }
    async read(state, step) {
        let options = ForgeFnOptions.fromStep(step.info);
        if (options.fn === undefined) {
            options.fn = NoOpRead;
        }
        let streamOptions = step.info.streamOptions || {};
        streamOptions.objectMode = options.object;
        return new readable_stream_1.Readable({
            async read(size) {
                if (options.fn == null) {
                    this.push(null);
                    return;
                }
                try {
                    let cast = options.fn;
                    for await (let res of cast(size)) {
                        this.push(res);
                    }
                    this.push(null);
                }
                catch (err) {
                    this.destroy(err);
                }
            },
            ...streamOptions
        });
    }
    async write(state, step) {
        return this.createStream(step);
    }
    async transform(state, step) {
        return this.createStream(step);
    }
}
exports.ForgeFn = ForgeFn;
ForgeFn.type = 'forge-internal-fn-plugin';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yZ2VGbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wbHVnaW5zL0ZvcmdlRm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWlGO0FBUWpGLEtBQUssVUFBVSxTQUFTLENBQUMsS0FBVSxFQUFFLFFBQWdCO0lBQ2xELE9BQU8sS0FBSyxDQUFBO0FBQ2YsQ0FBQztBQUVELEtBQUssU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQVk7SUFDbEMsS0FBSyxDQUFBO0FBQ1IsQ0FBQztBQUVELE1BQU0sY0FBYztJQUlqQjtRQUhBLE9BQUUsR0FBaUMsU0FBUyxDQUFBO1FBQzVDLFdBQU0sR0FBWSxJQUFJLENBQUE7SUFJdEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFjO1FBQzNCOzs7Ozs7O1VBT0U7UUFDRixJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFBO1FBRWxDLElBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLEVBQUU7WUFDakIsSUFBRyxPQUFPLElBQUksQ0FBQyxFQUFFLEtBQUssVUFBVSxFQUFFO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDRHQUE0RyxPQUFPLElBQUksQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO2FBQ3ZKO1lBRUQsT0FBTyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFBO1NBQ3RCO1FBRUQsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQTtRQUVwQyxPQUFPLE9BQU8sQ0FBQTtJQUNqQixDQUFDO0NBQ0g7QUFFRCxNQUFhLE9BQU87SUFBcEI7UUFFWSxTQUFJLEdBQVcsT0FBTyxDQUFDLElBQUksQ0FBQTtJQW9FdkMsQ0FBQztJQWxFRSxZQUFZLENBQUMsSUFBVztRQUNyQixJQUFJLE9BQU8sR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVoRCxJQUFHLE9BQU8sQ0FBQyxFQUFFLEtBQUssU0FBUyxFQUFFO1lBQzFCLE9BQU8sQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFBO1NBQ3hCO1FBRUQsSUFBSSxhQUFhLEdBQXFCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLEVBQUUsQ0FBQTtRQUNuRSxhQUFhLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUE7UUFFekMsT0FBTyxJQUFJLDJCQUFTLENBQUM7WUFDbEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFVLEVBQUUsUUFBZ0IsRUFBRSxRQUFRO2dCQUNuRCxJQUFHLE9BQU8sQ0FBQyxFQUFFLElBQUksSUFBSSxFQUFFO29CQUNwQixPQUFPLFFBQVEsRUFBRSxDQUFBO2lCQUNuQjtnQkFFRCxJQUFJO29CQUNELFFBQVEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO2lCQUN4RDtnQkFBQyxPQUFNLEdBQUcsRUFBRTtvQkFDVixRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQ2Y7WUFDSixDQUFDO1lBQ0QsR0FBRyxhQUFhO1NBQ2xCLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQWtCLEVBQUUsSUFBVztRQUN2QyxJQUFJLE9BQU8sR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVoRCxJQUFHLE9BQU8sQ0FBQyxFQUFFLEtBQUssU0FBUyxFQUFFO1lBQzFCLE9BQU8sQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFBO1NBQ3ZCO1FBRUQsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFBO1FBQ2pELGFBQWEsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQTtRQUV6QyxPQUFPLElBQUksMEJBQVEsQ0FBQztZQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLElBQVk7Z0JBQ3BCLElBQUcsT0FBTyxDQUFDLEVBQUUsSUFBSSxJQUFJLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBQ2YsT0FBTTtpQkFDUjtnQkFFRCxJQUFJO29CQUNELElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxFQUFZLENBQUE7b0JBRS9CLElBQUksS0FBSyxFQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtxQkFDaEI7b0JBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtpQkFDakI7Z0JBQUMsT0FBTSxHQUFHLEVBQUU7b0JBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDbkI7WUFDSixDQUFDO1lBQ0QsR0FBRyxhQUFhO1NBQ2xCLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQWtCLEVBQUUsSUFBVztRQUN4QyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDakMsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBa0IsRUFBRSxJQUFXO1FBQzVDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNqQyxDQUFDOztBQXJFSiwwQkFzRUM7QUFyRWtCLFlBQUksR0FBVywwQkFBMEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlYWRhYmxlLCBXcml0YWJsZSwgVHJhbnNmb3JtLCBUcmFuc2Zvcm1PcHRpb25zIH0gZnJvbSAncmVhZGFibGUtc3RyZWFtJ1xuaW1wb3J0IHsgSVBsdWdpbiB9IGZyb20gXCIuL0lQbHVnaW5cIlxuaW1wb3J0IHsgSUJ1aWxkU3RhdGUgfSBmcm9tICcuLi9jb3JlL0J1aWxkU3RhdGUnXG5pbXBvcnQgeyBJU3RlcCwgU3RlcEluZm8gfSBmcm9tIFwiLi4vY29yZS9TdGVwXCJcblxudHlwZSBXcml0ZUZuID0gKGNodW5rOiBhbnksIGVuY29kaW5nOiBzdHJpbmcpID0+IFByb21pc2U8YW55PlxudHlwZSBSZWFkRm4gPSAoc2l6ZTogbnVtYmVyKSA9PiBBc3luY0dlbmVyYXRvcjxhbnk+XG5cbmFzeW5jIGZ1bmN0aW9uIE5vT3BXcml0ZShjaHVuazogYW55LCBlbmNvZGluZzogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgIHJldHVybiBjaHVua1xufVxuXG5hc3luYyBmdW5jdGlvbiogTm9PcFJlYWQoc2l6ZTogbnVtYmVyKTogQXN5bmNHZW5lcmF0b3I8YW55PiB7XG4gICB5aWVsZFxufVxuXG5jbGFzcyBGb3JnZUZuT3B0aW9ucyB7XG4gICBmbjogV3JpdGVGbiB8IFJlYWRGbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICAgb2JqZWN0OiBib29sZWFuID0gdHJ1ZVxuXG4gICBjb25zdHJ1Y3RvcigpIHtcblxuICAgfVxuXG4gICAvKipcbiAgICAqIE5vcm1hbGl6ZXMgdGhlIFN0ZXAgaW5mb3JtYXRpb24gaW50byBhIEZvcmdlRm5PcHRpb25zIG9iamVjdC5cbiAgICAqIFxuICAgICogQHBhcmFtIGluZm8gVGhlIHN0ZXAgaW5mbyBcbiAgICAqIEByZXR1cm5zIEZvcmdlRm5PcHRpb25zXG4gICAgKi9cbiAgIHN0YXRpYyBmcm9tU3RlcChpbmZvOiBTdGVwSW5mbyk6IEZvcmdlRm5PcHRpb25zIHtcbiAgICAgIC8qXG4gICAgICAgICB7XG4gICAgICAgICAgICBhbGlhczogJycsXG4gICAgICAgICAgICBwbHVnaW46ICc6Zm4nLFxuICAgICAgICAgICAgZm46IGFzeW5jIChjaHVuaywgZW5jb2RpbmcpID0+IHsgfSxcbiAgICAgICAgICAgIG9iamVjdD86IGJvb2xlYW5cbiAgICAgICAgIH1cbiAgICAgICovXG4gICAgICBsZXQgb3B0aW9ucyA9IG5ldyBGb3JnZUZuT3B0aW9ucygpXG5cbiAgICAgIGlmKGluZm8uZm4gIT0gbnVsbCkge1xuICAgICAgICAgaWYodHlwZW9mIGluZm8uZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRW5jb3VudGVyZWQgdGhlIHdyb25nIHR5cGUgZm9yIGFuICdmbicgcHJvcGVydHkgZm9yIGEgZm9yZ2U6Zm4gc3RlcC4gRXhwZWN0ZWQgJ2Z1bmN0aW9uJywgYnV0IHJlY2VpdmVkIGEgJHt0eXBlb2YgaW5mby5mbn0gaW5zdGVhZGApXG4gICAgICAgICB9XG5cbiAgICAgICAgIG9wdGlvbnMuZm4gPSBpbmZvLmZuXG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMub2JqZWN0ID0gaW5mby5vYmplY3QgfHwgdHJ1ZVxuXG4gICAgICByZXR1cm4gb3B0aW9uc1xuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm9yZ2VGbiBpbXBsZW1lbnRzIElQbHVnaW4ge1xuICAgc3RhdGljIHJlYWRvbmx5IHR5cGU6IHN0cmluZyA9ICdmb3JnZS1pbnRlcm5hbC1mbi1wbHVnaW4nXG4gICByZWFkb25seSBuYW1lOiBzdHJpbmcgPSBGb3JnZUZuLnR5cGVcblxuICAgY3JlYXRlU3RyZWFtKHN0ZXA6IElTdGVwKTogVHJhbnNmb3JtIHtcbiAgICAgIGxldCBvcHRpb25zID0gRm9yZ2VGbk9wdGlvbnMuZnJvbVN0ZXAoc3RlcC5pbmZvKVxuXG4gICAgICBpZihvcHRpb25zLmZuID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIG9wdGlvbnMuZm4gPSBOb09wV3JpdGVcbiAgICAgIH1cblxuICAgICAgbGV0IHN0cmVhbU9wdGlvbnM6IFRyYW5zZm9ybU9wdGlvbnMgPSBzdGVwLmluZm8uc3RyZWFtT3B0aW9ucyB8fCB7fVxuICAgICAgc3RyZWFtT3B0aW9ucy5vYmplY3RNb2RlID0gb3B0aW9ucy5vYmplY3RcblxuICAgICAgcmV0dXJuIG5ldyBUcmFuc2Zvcm0oe1xuICAgICAgICAgYXN5bmMgdHJhbnNmb3JtKGNodW5rOiBhbnksIGVuY29kaW5nOiBzdHJpbmcsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZihvcHRpb25zLmZuID09IG51bGwpIHtcbiAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICBjYWxsYmFjayh1bmRlZmluZWQsIGF3YWl0IG9wdGlvbnMuZm4oY2h1bmssIGVuY29kaW5nKSlcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgICB9LFxuICAgICAgICAgLi4uc3RyZWFtT3B0aW9uc1xuICAgICAgfSlcbiAgIH1cblxuICAgYXN5bmMgcmVhZChzdGF0ZTogSUJ1aWxkU3RhdGUsIHN0ZXA6IElTdGVwKTogUHJvbWlzZTxSZWFkYWJsZT4ge1xuICAgICAgbGV0IG9wdGlvbnMgPSBGb3JnZUZuT3B0aW9ucy5mcm9tU3RlcChzdGVwLmluZm8pXG5cbiAgICAgIGlmKG9wdGlvbnMuZm4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgb3B0aW9ucy5mbiA9IE5vT3BSZWFkXG4gICAgICB9XG5cbiAgICAgIGxldCBzdHJlYW1PcHRpb25zID0gc3RlcC5pbmZvLnN0cmVhbU9wdGlvbnMgfHwge31cbiAgICAgIHN0cmVhbU9wdGlvbnMub2JqZWN0TW9kZSA9IG9wdGlvbnMub2JqZWN0XG5cbiAgICAgIHJldHVybiBuZXcgUmVhZGFibGUoe1xuICAgICAgICAgYXN5bmMgcmVhZChzaXplOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuZm4gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgdGhpcy5wdXNoKG51bGwpXG4gICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgIGxldCBjYXN0ID0gb3B0aW9ucy5mbiBhcyBSZWFkRm5cblxuICAgICAgICAgICAgICAgZm9yIGF3YWl0KGxldCByZXMgb2YgY2FzdChzaXplKSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHJlcylcbiAgICAgICAgICAgICAgIH1cbiAgIFxuICAgICAgICAgICAgICAgdGhpcy5wdXNoKG51bGwpXG4gICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgdGhpcy5kZXN0cm95KGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0sXG4gICAgICAgICAuLi5zdHJlYW1PcHRpb25zXG4gICAgICB9KVxuICAgfVxuXG4gICBhc3luYyB3cml0ZShzdGF0ZTogSUJ1aWxkU3RhdGUsIHN0ZXA6IElTdGVwKTogUHJvbWlzZTxXcml0YWJsZT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU3RyZWFtKHN0ZXApXG4gICB9XG5cbiAgIGFzeW5jIHRyYW5zZm9ybShzdGF0ZTogSUJ1aWxkU3RhdGUsIHN0ZXA6IElTdGVwKTogUHJvbWlzZTxUcmFuc2Zvcm0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVN0cmVhbShzdGVwKVxuICAgfVxufSJdfQ==