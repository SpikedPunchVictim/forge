"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeBuffer = void 0;
const streams_1 = require("../streams");
class ForgeBufferOptions {
    constructor() {
        this.object = false;
        this.size = 1024;
    }
    static fromStep(info) {
        let options = new ForgeBufferOptions();
        if (info.object != null) {
            if (typeof info.object !== 'boolean') {
                throw new Error(`Encountered the wrong type for an 'object' property for a forge:buffer step. Expected 'boolean', but received a ${typeof info.object} instead`);
            }
            options.object = info.object;
        }
        if (info.size != null) {
            if (typeof info.size !== 'number') {
                throw new Error(`Encountered the wrong type for an 'size' property for a forge:buffer step. Expected 'number', but received a ${typeof info.size} instead`);
            }
            options.size = info.size;
        }
        return options;
    }
}
class ForgeBuffer {
    constructor() {
        this.name = ForgeBuffer.type;
    }
    read(state, step) {
        throw new Error(`${ForgeBuffer.type} does not support read streams`);
    }
    async write(state, step) {
        let options = ForgeBufferOptions.fromStep(step.info);
        let streamOptions = step.info.streamOptions == null ? {} : step.info.streamOptions;
        if (options.object != null) {
            streamOptions.objectMode = options.object;
        }
        return new streams_1.BufferStream(options.size, streamOptions);
    }
    async transform(state, step) {
        let options = ForgeBufferOptions.fromStep(step.info);
        let streamOptions = step.info.streamOptions == null ? {} : step.info.streamOptions;
        if (options.object != null) {
            streamOptions.objectMode = options.object;
        }
        return new streams_1.BufferStream(options.size, streamOptions);
    }
}
exports.ForgeBuffer = ForgeBuffer;
ForgeBuffer.type = 'forge-internal-buffer-plugin';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yZ2VCdWZmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGx1Z2lucy9Gb3JnZUJ1ZmZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSx3Q0FBeUM7QUFFekMsTUFBTSxrQkFBa0I7SUFJckI7UUFIQSxXQUFNLEdBQVksS0FBSyxDQUFBO1FBQ3ZCLFNBQUksR0FBVyxJQUFJLENBQUE7SUFJbkIsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBYztRQUMzQixJQUFJLE9BQU8sR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUE7UUFFdEMsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtZQUNyQixJQUFHLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsbUhBQW1ILE9BQU8sSUFBSSxDQUFDLE1BQU0sVUFBVSxDQUFDLENBQUE7YUFDbEs7WUFFRCxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7U0FDOUI7UUFFRCxJQUFHLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ25CLElBQUcsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnSEFBZ0gsT0FBTyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQTthQUM3SjtZQUVELE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtTQUMxQjtRQUVELE9BQU8sT0FBTyxDQUFBO0lBQ2pCLENBQUM7Q0FDSDtBQUVELE1BQWEsV0FBVztJQUF4QjtRQUVZLFNBQUksR0FBVyxXQUFXLENBQUMsSUFBSSxDQUFBO0lBNkIzQyxDQUFDO0lBM0JFLElBQUksQ0FBQyxLQUFrQixFQUFFLElBQVc7UUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLFdBQVcsQ0FBQyxJQUFJLGdDQUFnQyxDQUFDLENBQUE7SUFDdkUsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBa0IsRUFBRSxJQUFXO1FBQ3hDLElBQUksT0FBTyxHQUFHLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFcEQsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFBO1FBRW5GLElBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDeEIsYUFBYSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFBO1NBQzNDO1FBRUQsT0FBTyxJQUFJLHNCQUFZLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQTtJQUN2RCxDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFrQixFQUFFLElBQVc7UUFDNUMsSUFBSSxPQUFPLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVwRCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUE7UUFFbkYsSUFBRyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtZQUN4QixhQUFhLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUE7U0FDM0M7UUFFRCxPQUFPLElBQUksc0JBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFBO0lBQ3ZELENBQUM7O0FBOUJKLGtDQStCQztBQTlCa0IsZ0JBQUksR0FBVyw4QkFBOEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlYWRhYmxlLCBUcmFuc2Zvcm0sIFdyaXRhYmxlIH0gZnJvbSAncmVhZGFibGUtc3RyZWFtJ1xuaW1wb3J0IHsgSVBsdWdpbiB9IGZyb20gXCIuL0lQbHVnaW5cIlxuaW1wb3J0IHsgSUJ1aWxkU3RhdGUgfSBmcm9tICcuLi9jb3JlL0J1aWxkU3RhdGUnXG5pbXBvcnQgeyBJU3RlcCwgU3RlcEluZm8gfSBmcm9tIFwiLi4vY29yZS9TdGVwXCJcbmltcG9ydCB7IEJ1ZmZlclN0cmVhbSB9IGZyb20gJy4uL3N0cmVhbXMnXG5cbmNsYXNzIEZvcmdlQnVmZmVyT3B0aW9ucyB7XG4gICBvYmplY3Q6IGJvb2xlYW4gPSBmYWxzZVxuICAgc2l6ZTogbnVtYmVyID0gMTAyNFxuXG4gICBjb25zdHJ1Y3RvcigpIHtcblxuICAgfVxuXG4gICBzdGF0aWMgZnJvbVN0ZXAoaW5mbzogU3RlcEluZm8pOiBGb3JnZUJ1ZmZlck9wdGlvbnMge1xuICAgICAgbGV0IG9wdGlvbnMgPSBuZXcgRm9yZ2VCdWZmZXJPcHRpb25zKClcblxuICAgICAgaWYoaW5mby5vYmplY3QgIT0gbnVsbCkge1xuICAgICAgICAgaWYodHlwZW9mIGluZm8ub2JqZWN0ICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRW5jb3VudGVyZWQgdGhlIHdyb25nIHR5cGUgZm9yIGFuICdvYmplY3QnIHByb3BlcnR5IGZvciBhIGZvcmdlOmJ1ZmZlciBzdGVwLiBFeHBlY3RlZCAnYm9vbGVhbicsIGJ1dCByZWNlaXZlZCBhICR7dHlwZW9mIGluZm8ub2JqZWN0fSBpbnN0ZWFkYClcbiAgICAgICAgIH1cblxuICAgICAgICAgb3B0aW9ucy5vYmplY3QgPSBpbmZvLm9iamVjdFxuICAgICAgfVxuXG4gICAgICBpZihpbmZvLnNpemUgIT0gbnVsbCkge1xuICAgICAgICAgaWYodHlwZW9mIGluZm8uc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRW5jb3VudGVyZWQgdGhlIHdyb25nIHR5cGUgZm9yIGFuICdzaXplJyBwcm9wZXJ0eSBmb3IgYSBmb3JnZTpidWZmZXIgc3RlcC4gRXhwZWN0ZWQgJ251bWJlcicsIGJ1dCByZWNlaXZlZCBhICR7dHlwZW9mIGluZm8uc2l6ZX0gaW5zdGVhZGApXG4gICAgICAgICB9XG5cbiAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IGluZm8uc2l6ZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3B0aW9uc1xuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm9yZ2VCdWZmZXIgaW1wbGVtZW50cyBJUGx1Z2luIHtcbiAgIHN0YXRpYyByZWFkb25seSB0eXBlOiBzdHJpbmcgPSAnZm9yZ2UtaW50ZXJuYWwtYnVmZmVyLXBsdWdpbidcbiAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZyA9IEZvcmdlQnVmZmVyLnR5cGVcblxuICAgcmVhZChzdGF0ZTogSUJ1aWxkU3RhdGUsIHN0ZXA6IElTdGVwKTogUHJvbWlzZTxSZWFkYWJsZT4ge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke0ZvcmdlQnVmZmVyLnR5cGV9IGRvZXMgbm90IHN1cHBvcnQgcmVhZCBzdHJlYW1zYClcbiAgIH1cblxuICAgYXN5bmMgd3JpdGUoc3RhdGU6IElCdWlsZFN0YXRlLCBzdGVwOiBJU3RlcCk6IFByb21pc2U8V3JpdGFibGU+IHtcbiAgICAgIGxldCBvcHRpb25zID0gRm9yZ2VCdWZmZXJPcHRpb25zLmZyb21TdGVwKHN0ZXAuaW5mbylcblxuICAgICAgbGV0IHN0cmVhbU9wdGlvbnMgPSBzdGVwLmluZm8uc3RyZWFtT3B0aW9ucyA9PSBudWxsID8geyB9IDogc3RlcC5pbmZvLnN0cmVhbU9wdGlvbnNcblxuICAgICAgaWYob3B0aW9ucy5vYmplY3QgIT0gbnVsbCkge1xuICAgICAgICAgc3RyZWFtT3B0aW9ucy5vYmplY3RNb2RlID0gb3B0aW9ucy5vYmplY3RcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBCdWZmZXJTdHJlYW0ob3B0aW9ucy5zaXplLCBzdHJlYW1PcHRpb25zKVxuICAgfVxuXG4gICBhc3luYyB0cmFuc2Zvcm0oc3RhdGU6IElCdWlsZFN0YXRlLCBzdGVwOiBJU3RlcCk6IFByb21pc2U8VHJhbnNmb3JtPiB7XG4gICAgICBsZXQgb3B0aW9ucyA9IEZvcmdlQnVmZmVyT3B0aW9ucy5mcm9tU3RlcChzdGVwLmluZm8pXG5cbiAgICAgIGxldCBzdHJlYW1PcHRpb25zID0gc3RlcC5pbmZvLnN0cmVhbU9wdGlvbnMgPT0gbnVsbCA/IHsgfSA6IHN0ZXAuaW5mby5zdHJlYW1PcHRpb25zXG5cbiAgICAgIGlmKG9wdGlvbnMub2JqZWN0ICE9IG51bGwpIHtcbiAgICAgICAgIHN0cmVhbU9wdGlvbnMub2JqZWN0TW9kZSA9IG9wdGlvbnMub2JqZWN0XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgQnVmZmVyU3RyZWFtKG9wdGlvbnMuc2l6ZSwgc3RyZWFtT3B0aW9ucylcbiAgIH1cbn0iXX0=