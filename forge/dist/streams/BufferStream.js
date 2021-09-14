"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferStream = void 0;
const readable_stream_1 = require("readable-stream");
var BufferEncoding;
(function (BufferEncoding) {
    BufferEncoding["NotSet"] = "not-set";
    BufferEncoding["Buffer"] = "buffer";
    BufferEncoding["Object"] = "object";
    BufferEncoding["String"] = "string";
})(BufferEncoding || (BufferEncoding = {}));
class BufferStream extends readable_stream_1.Transform {
    constructor(size = -1, options) {
        super(options);
        this.buffer = undefined;
        this.size = size;
        this.bufferEncoding = BufferEncoding.NotSet;
    }
    get objectMode() {
        return this._writableState.objectMode;
    }
    _transform(chunk, encoding, cb) {
        if (this.buffer === undefined) {
            if (this.objectMode) {
                this.buffer = new Array();
                this.bufferEncoding = BufferEncoding.Object;
            }
            else if (encoding === 'string') {
                this.buffer = '';
                this.bufferEncoding = BufferEncoding.String;
            }
            else if (encoding === 'buffer') {
                this.buffer = chunk;
                this.bufferEncoding = BufferEncoding.Buffer;
                let cast = this.buffer;
                if (cast.length >= this.size) {
                    cb(undefined, cast);
                    this.buffer = Buffer.alloc(0);
                }
                return;
            }
            else {
                throw new Error(`Unsupported encoding type encountered witht he Forge Buffer Stream`);
            }
        }
        // Should never get here
        if (this.buffer === undefined) {
            throw new Error(`'buffer' has not been initialized properly in the ForgeBufferStream`);
        }
        switch (this.bufferEncoding) {
            case BufferEncoding.Buffer: {
                this.buffer = Buffer.concat(chunk);
                if (this.size != -1 && this.buffer.byteLength >= this.size) {
                    cb(undefined, this.buffer);
                    this.buffer = Buffer.alloc(0);
                }
                else {
                    cb();
                }
                break;
            }
            case BufferEncoding.Object: {
                let cast = this.buffer;
                cast.push(chunk);
                if (this.size != -1 && cast.length >= this.size) {
                    cb(undefined, cast);
                    cast.splice(0, Math.max(0, cast.length - 1));
                }
                else {
                    cb();
                }
                break;
            }
            case BufferEncoding.String: {
                let cast = this.buffer;
                cast += chunk;
                if (this.size != -1 && cast.length >= this.size) {
                    cb(undefined, cast);
                    cast = '';
                }
                else {
                    cb();
                }
                break;
            }
            default: {
                cb();
            }
        }
    }
    _flush(cb) {
        try {
            switch (this.bufferEncoding) {
                case BufferEncoding.Buffer: {
                    let cast = this.buffer;
                    if (cast.byteLength > 0) {
                        cb(undefined, cast);
                        this.buffer = Buffer.alloc(0);
                    }
                    break;
                }
                case BufferEncoding.Object: {
                    let cast = this.buffer;
                    if (cast.length > 0) {
                        cb(undefined, cast);
                        cast.splice(0, Math.max(0, cast.length));
                    }
                    break;
                }
                case BufferEncoding.String: {
                    let cast = this.buffer;
                    if (cast.length > 0) {
                        cb(undefined, cast);
                        this.buffer = '';
                    }
                    break;
                }
                default: {
                    cb();
                }
            }
        }
        catch (err) {
            cb(err);
        }
    }
}
exports.BufferStream = BufferStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVmZmVyU3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmVhbXMvQnVmZmVyU3RyZWFtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUE2RDtBQUU3RCxJQUFLLGNBS0o7QUFMRCxXQUFLLGNBQWM7SUFDaEIsb0NBQWtCLENBQUE7SUFDbEIsbUNBQWlCLENBQUE7SUFDakIsbUNBQWlCLENBQUE7SUFDakIsbUNBQWlCLENBQUE7QUFDcEIsQ0FBQyxFQUxJLGNBQWMsS0FBZCxjQUFjLFFBS2xCO0FBRUQsTUFBYSxZQUFhLFNBQVEsMkJBQVM7SUFVeEMsWUFBWSxPQUFlLENBQUMsQ0FBQyxFQUFFLE9BQTBCO1FBQ3RELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQVJULFdBQU0sR0FBNEMsU0FBUyxDQUFBO1FBU2hFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQTtJQUM5QyxDQUFDO0lBUkQsSUFBSSxVQUFVO1FBQ1gsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQTtJQUN4QyxDQUFDO0lBUUQsVUFBVSxDQUFDLEtBQVUsRUFBRSxRQUFnQixFQUFFLEVBQW1EO1FBQ3pGLElBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDM0IsSUFBRyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxFQUFPLENBQUE7Z0JBQzlCLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQTthQUM3QztpQkFBTSxJQUFHLFFBQVEsS0FBSyxRQUFRLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFBO2dCQUNoQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUE7YUFDN0M7aUJBQU0s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ICdyZWFkYWJsZS1zdHJlYW0nXG5cbmVudW0gQnVmZmVyRW5jb2Rpbmcge1xuICAgTm90U2V0ID0gJ25vdC1zZXQnLFxuICAgQnVmZmVyID0gJ2J1ZmZlcicsXG4gICBPYmplY3QgPSAnb2JqZWN0JyxcbiAgIFN0cmluZyA9ICdzdHJpbmcnXG59XG5cbmV4cG9ydCBjbGFzcyBCdWZmZXJTdHJlYW0gZXh0ZW5kcyBUcmFuc2Zvcm0ge1xuICAgcmVhZG9ubHkgc2l6ZTogbnVtYmVyXG5cbiAgIHByaXZhdGUgYnVmZmVyOiBhbnlbXSB8IFVpbnQ4QXJyYXkgfCBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgIHByaXZhdGUgYnVmZmVyRW5jb2Rpbmc6IEJ1ZmZlckVuY29kaW5nXG4gICBcbiAgIGdldCBvYmplY3RNb2RlKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3dyaXRhYmxlU3RhdGUub2JqZWN0TW9kZVxuICAgfVxuXG4gICBjb25zdHJ1Y3RvcihzaXplOiBudW1iZXIgPSAtMSwgb3B0aW9ucz86IFRyYW5zZm9ybU9wdGlvbnMpIHtcbiAgICAgIHN1cGVyKG9wdGlvbnMpXG4gICAgICB0aGlzLnNpemUgPSBzaXplXG4gICAgICB0aGlzLmJ1ZmZlckVuY29kaW5nID0gQnVmZmVyRW5jb2RpbmcuTm90U2V0XG4gICB9XG5cbiAgIF90cmFuc2Zvcm0oY2h1bms6IGFueSwgZW5jb2Rpbmc6IHN0cmluZywgY2I6IChlcnJvcj86IEVycm9yIHwgdW5kZWZpbmVkLCBkYXRhPzogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICBpZih0aGlzLmJ1ZmZlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICBpZih0aGlzLm9iamVjdE1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gbmV3IEFycmF5PGFueT4oKVxuICAgICAgICAgICAgdGhpcy5idWZmZXJFbmNvZGluZyA9IEJ1ZmZlckVuY29kaW5nLk9iamVjdFxuICAgICAgICAgfSBlbHNlIGlmKGVuY29kaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5idWZmZXIgPSAnJ1xuICAgICAgICAgICAgdGhpcy5idWZmZXJFbmNvZGluZyA9IEJ1ZmZlckVuY29kaW5nLlN0cmluZ1xuICAgICAgICAgfSBlbHNlIGlmKGVuY29kaW5nID09PSAnYnVmZmVyJykge1xuICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBjaHVua1xuICAgICAgICAgICAgdGhpcy5idWZmZXJFbmNvZGluZyA9IEJ1ZmZlckVuY29kaW5nLkJ1ZmZlclxuXG4gICAgICAgICAgICBsZXQgY2FzdCA9IHRoaXMuYnVmZmVyIGFzIEJ1ZmZlclxuXG4gICAgICAgICAgICBpZihjYXN0Lmxlbmd0aCA+PSB0aGlzLnNpemUpIHtcbiAgICAgICAgICAgICAgIGNiKHVuZGVmaW5lZCwgY2FzdClcbiAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gQnVmZmVyLmFsbG9jKDApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZW5jb2RpbmcgdHlwZSBlbmNvdW50ZXJlZCB3aXRodCBoZSBGb3JnZSBCdWZmZXIgU3RyZWFtYClcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU2hvdWxkIG5ldmVyIGdldCBoZXJlXG4gICAgICBpZih0aGlzLmJ1ZmZlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCdidWZmZXInIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCBwcm9wZXJseSBpbiB0aGUgRm9yZ2VCdWZmZXJTdHJlYW1gKVxuICAgICAgfVxuXG4gICAgICBzd2l0Y2godGhpcy5idWZmZXJFbmNvZGluZykge1xuICAgICAgICAgY2FzZSBCdWZmZXJFbmNvZGluZy5CdWZmZXI6IHtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gQnVmZmVyLmNvbmNhdChjaHVuaylcblxuICAgICAgICAgICAgaWYodGhpcy5zaXplICE9IC0xICYmIHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGggPj0gdGhpcy5zaXplKSB7XG4gICAgICAgICAgICAgICBjYih1bmRlZmluZWQsIHRoaXMuYnVmZmVyKVxuICAgICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBCdWZmZXIuYWxsb2MoMClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBjYigpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICB9XG4gICAgICAgICBjYXNlIEJ1ZmZlckVuY29kaW5nLk9iamVjdDoge1xuICAgICAgICAgICAgbGV0IGNhc3QgPSB0aGlzLmJ1ZmZlciBhcyBBcnJheTxhbnk+XG5cbiAgICAgICAgICAgIGNhc3QucHVzaChjaHVuaylcbiAgIFxuICAgICAgICAgICAgaWYodGhpcy5zaXplICE9IC0xICYmIGNhc3QubGVuZ3RoID49IHRoaXMuc2l6ZSkge1xuICAgICAgICAgICAgICAgY2IodW5kZWZpbmVkLCBjYXN0KVxuICAgICAgICAgICAgICAgY2FzdC5zcGxpY2UoMCwgTWF0aC5tYXgoMCwgY2FzdC5sZW5ndGggLSAxKSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBjYigpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICB9XG4gICAgICAgICBjYXNlIEJ1ZmZlckVuY29kaW5nLlN0cmluZzoge1xuICAgICAgICAgICAgbGV0IGNhc3QgPSB0aGlzLmJ1ZmZlciBhcyBzdHJpbmdcbiAgICAgICAgICAgIGNhc3QgKz0gY2h1bmtcbiAgIFxuICAgICAgICAgICAgaWYodGhpcy5zaXplICE9IC0xICYmIGNhc3QubGVuZ3RoID49IHRoaXMuc2l6ZSkge1xuICAgICAgICAgICAgICAgY2IodW5kZWZpbmVkLCBjYXN0KVxuICAgICAgICAgICAgICAgY2FzdCA9ICcnXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgY2IoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgfVxuICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgY2IoKVxuICAgICAgICAgfVxuICAgICAgfVxuICAgfVxuXG4gICBfZmx1c2goY2I6IChlcnJvcj86IEVycm9yIHwgdW5kZWZpbmVkLCBkYXRhPzogYW55KSA9PiB2b2lkKSB7XG4gICAgICB0cnkge1xuICAgICAgICAgc3dpdGNoKHRoaXMuYnVmZmVyRW5jb2RpbmcpIHtcbiAgICAgICAgICAgIGNhc2UgQnVmZmVyRW5jb2RpbmcuQnVmZmVyOiB7XG4gICAgICAgICAgICAgICBsZXQgY2FzdCA9IHRoaXMuYnVmZmVyIGFzIEJ1ZmZlclxuXG4gICAgICAgICAgICAgICBpZihjYXN0LmJ5dGVMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICBjYih1bmRlZmluZWQsIGNhc3QpXG4gICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygwKVxuICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBCdWZmZXJFbmNvZGluZy5PYmplY3Q6IHtcbiAgICAgICAgICAgICAgIGxldCBjYXN0ID0gdGhpcy5idWZmZXIgYXMgQXJyYXk8YW55PlxuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICBpZihjYXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIGNiKHVuZGVmaW5lZCwgY2FzdClcbiAgICAgICAgICAgICAgICAgIGNhc3Quc3BsaWNlKDAsIE1hdGgubWF4KDAsIGNhc3QubGVuZ3RoKSlcbiAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgQnVmZmVyRW5jb2RpbmcuU3RyaW5nOiB7XG4gICAgICAgICAgICAgICBsZXQgY2FzdCA9IHRoaXMuYnVmZmVyIGFzIHN0cmluZ1xuXG4gICAgICAgICAgICAgICBpZihjYXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIGNiKHVuZGVmaW5lZCwgY2FzdClcbiAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gJydcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgIGNiKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICBjYihlcnIpXG4gICAgICB9XG4gICB9XG59Il19