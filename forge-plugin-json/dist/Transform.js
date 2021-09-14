"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTransformStream = void 0;
const readable_stream_1 = require("readable-stream");
const Writable_1 = require("./Writable");
class JsonTransformStream extends readable_stream_1.Transform {
    constructor(outFile) {
        super();
        if (outFile != null) {
            this.writeFileStream = new Writable_1.JsonWritableStream(outFile);
        }
        this.cache = '';
    }
    _transform(chunk, encoding, callback) {
        let next = (err) => {
            if (err) {
                return callback(err, null);
            }
            try {
                if (encoding === 'buffer') {
                    chunk = Buffer.from(chunk).toString('utf8');
                }
                this.cache += chunk;
                callback();
            }
            catch (err) {
                callback(err);
            }
        };
        if (this.writeFileStream !== undefined) {
            this.writeFileStream.write(chunk, next);
        }
        else {
            next(null);
        }
    }
    _final(callback) {
        callback(undefined, this.cache);
    }
}
exports.JsonTransformStream = JsonTransformStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1RyYW5zZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxREFBNEM7QUFDNUMseUNBQWdEO0FBR2hELE1BQWEsbUJBQW9CLFNBQVEsMkJBQVM7SUFJL0MsWUFBWSxPQUFnQjtRQUN6QixLQUFLLEVBQUUsQ0FBQTtRQUVQLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUNsQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksNkJBQWtCLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDeEQ7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtJQUNsQixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQVUsRUFBRSxRQUFnQixFQUFFLFFBQXlEO1FBQy9GLElBQUksSUFBSSxHQUFHLENBQUMsR0FBNkIsRUFBRSxFQUFFO1lBQzFDLElBQUcsR0FBRyxFQUFFO2dCQUNMLE9BQU8sUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTthQUM1QjtZQUVELElBQUk7Z0JBQ0QsSUFBRyxRQUFRLEtBQUssUUFBUSxFQUFFO29CQUN2QixLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7aUJBQzdDO2dCQUVELElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFBO2dCQUNuQixRQUFRLEVBQUUsQ0FBQTthQUNaO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1gsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2FBQ2Y7UUFDSixDQUFDLENBQUE7UUFFRCxJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssU0FBUyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUN6QzthQUFNO1lBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ1o7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQXlEO1FBQzdELFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLENBQUM7Q0FDSDtBQTFDRCxrREEwQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwicmVhZGFibGUtc3RyZWFtXCI7XG5pbXBvcnQgeyBKc29uV3JpdGFibGVTdHJlYW0gfSBmcm9tIFwiLi9Xcml0YWJsZVwiO1xuXG5cbmV4cG9ydCBjbGFzcyBKc29uVHJhbnNmb3JtU3RyZWFtIGV4dGVuZHMgVHJhbnNmb3JtIHtcbiAgIHByaXZhdGUgd3JpdGVGaWxlU3RyZWFtOiBKc29uV3JpdGFibGVTdHJlYW0gfCB1bmRlZmluZWRcbiAgIHByaXZhdGUgY2FjaGU6IHN0cmluZ1xuXG4gICBjb25zdHJ1Y3RvcihvdXRGaWxlPzogc3RyaW5nKSB7XG4gICAgICBzdXBlcigpXG5cbiAgICAgIGlmIChvdXRGaWxlICE9IG51bGwpIHtcbiAgICAgICAgIHRoaXMud3JpdGVGaWxlU3RyZWFtID0gbmV3IEpzb25Xcml0YWJsZVN0cmVhbShvdXRGaWxlKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNhY2hlID0gJydcbiAgIH1cblxuICAgX3RyYW5zZm9ybShjaHVuazogYW55LCBlbmNvZGluZzogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yPzogRXJyb3IgfCB1bmRlZmluZWQsIGRhdGE/OiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgIGxldCBuZXh0ID0gKGVycjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkKSA9PiB7XG4gICAgICAgICBpZihlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpXG4gICAgICAgICB9XG5cbiAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZihlbmNvZGluZyA9PT0gJ2J1ZmZlcicpIHtcbiAgICAgICAgICAgICAgIGNodW5rID0gQnVmZmVyLmZyb20oY2h1bmspLnRvU3RyaW5nKCd1dGY4JylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jYWNoZSArPSBjaHVua1xuICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIpXG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLndyaXRlRmlsZVN0cmVhbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aGlzLndyaXRlRmlsZVN0cmVhbS53cml0ZShjaHVuaywgbmV4dClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBuZXh0KG51bGwpXG4gICAgICB9XG4gICB9XG5cbiAgIF9maW5hbChjYWxsYmFjazogKGVycm9yPzogRXJyb3IgfCB1bmRlZmluZWQsIGRhdGE/OiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgIGNhbGxiYWNrKHVuZGVmaW5lZCwgdGhpcy5jYWNoZSlcbiAgIH1cbn0iXX0=