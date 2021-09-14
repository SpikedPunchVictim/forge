"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonWritableStream = void 0;
const readable_stream_1 = require("readable-stream");
const fs = require("fs-extra");
class JsonWritableStream extends readable_stream_1.Writable {
    constructor(outFile, space = 0) {
        super({
            decodeStrings: false,
            defaultEncoding: 'utf8'
        });
        this.stream = undefined;
        this.outFile = outFile;
        this.space = space;
    }
    _write(chunk, encoding, callback) {
        if (encoding === 'buffer') {
            chunk = Buffer.from(chunk).toString('utf8');
        }
        if (this.stream === undefined) {
            fs.ensureFile(this.outFile, (err) => {
                if (err) {
                    return callback(err);
                }
                this.stream = fs.createWriteStream(this.outFile, {
                    flags: 'r+',
                    encoding: 'utf8'
                });
                if (this.stream === undefined) {
                    throw new Error(`Failed to create a writable stream to file ${this.outFile}.`);
                }
                this.stream.write(chunk, callback);
            });
        }
        else {
            if (this.stream === undefined) {
                throw new Error(`Failed to create a writable stream to file ${this.outFile}.`);
            }
            this.stream.write(chunk, callback);
        }
    }
    _final(callback) {
        if (this.stream !== undefined) {
            return this.stream.end(callback);
        }
        callback();
    }
}
exports.JsonWritableStream = JsonWritableStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV3JpdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvV3JpdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQTBDO0FBQzFDLCtCQUE4QjtBQUU5QixNQUFhLGtCQUFtQixTQUFRLDBCQUFRO0lBSzdDLFlBQVksT0FBZSxFQUFFLFFBQWdCLENBQUM7UUFDM0MsS0FBSyxDQUFDO1lBQ0gsYUFBYSxFQUFFLEtBQUs7WUFDcEIsZUFBZSxFQUFFLE1BQU07U0FDekIsQ0FBQyxDQUFBO1FBTkcsV0FBTSxHQUF5QixTQUFTLENBQUE7UUFRN0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7SUFDckIsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFVLEVBQUUsUUFBZ0IsRUFBRSxRQUF3QztRQUMxRSxJQUFHLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDdkIsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQzdDO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUM1QixFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFVLEVBQUUsRUFBRTtnQkFDeEMsSUFBRyxHQUFHLEVBQUU7b0JBQ0wsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQ3RCO2dCQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQzlDLEtBQUssRUFBRSxJQUFJO29CQUNYLFFBQVEsRUFBRSxNQUFNO2lCQUNsQixDQUFDLENBQUE7Z0JBRUYsSUFBRyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtvQkFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUE7aUJBQ2hGO2dCQUVELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQTtZQUNyQyxDQUFDLENBQUMsQ0FBQTtTQUNKO2FBQU07WUFDSixJQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTthQUNoRjtZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQTtTQUNwQztJQUNKLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBd0M7UUFDNUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ2xDO1FBRUQsUUFBUSxFQUFFLENBQUE7SUFDYixDQUFDO0NBQ0g7QUFyREQsZ0RBcURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgV3JpdGFibGUgfSBmcm9tICdyZWFkYWJsZS1zdHJlYW0nXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSdcblxuZXhwb3J0IGNsYXNzIEpzb25Xcml0YWJsZVN0cmVhbSBleHRlbmRzIFdyaXRhYmxlIHtcbiAgIHJlYWRvbmx5IG91dEZpbGU6IHN0cmluZ1xuICAgcmVhZG9ubHkgc3BhY2U6IG51bWJlclxuICAgcHJpdmF0ZSBzdHJlYW06IFdyaXRhYmxlIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgIGNvbnN0cnVjdG9yKG91dEZpbGU6IHN0cmluZywgc3BhY2U6IG51bWJlciA9IDApIHtcbiAgICAgIHN1cGVyKHtcbiAgICAgICAgIGRlY29kZVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgZGVmYXVsdEVuY29kaW5nOiAndXRmOCdcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub3V0RmlsZSA9IG91dEZpbGVcbiAgICAgIHRoaXMuc3BhY2UgPSBzcGFjZVxuICAgfVxuXG4gICBfd3JpdGUoY2h1bms6IGFueSwgZW5jb2Rpbmc6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcj86IEVycm9yIHwgbnVsbCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgaWYoZW5jb2RpbmcgPT09ICdidWZmZXInKSB7XG4gICAgICAgICBjaHVuayA9IEJ1ZmZlci5mcm9tKGNodW5rKS50b1N0cmluZygndXRmOCcpXG4gICAgICB9XG4gICBcbiAgICAgIGlmICh0aGlzLnN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICBmcy5lbnN1cmVGaWxlKHRoaXMub3V0RmlsZSwgKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgIGlmKGVycikge1xuICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbSh0aGlzLm91dEZpbGUsIHtcbiAgICAgICAgICAgICAgIGZsYWdzOiAncisnLFxuICAgICAgICAgICAgICAgZW5jb2Rpbmc6ICd1dGY4J1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYodGhpcy5zdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gY3JlYXRlIGEgd3JpdGFibGUgc3RyZWFtIHRvIGZpbGUgJHt0aGlzLm91dEZpbGV9LmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc3RyZWFtLndyaXRlKGNodW5rLCBjYWxsYmFjaylcbiAgICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgaWYodGhpcy5zdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gY3JlYXRlIGEgd3JpdGFibGUgc3RyZWFtIHRvIGZpbGUgJHt0aGlzLm91dEZpbGV9LmApXG4gICAgICAgICB9XG4gICBcbiAgICAgICAgIHRoaXMuc3RyZWFtLndyaXRlKGNodW5rLCBjYWxsYmFjaylcbiAgICAgIH1cbiAgIH1cblxuICAgX2ZpbmFsKGNhbGxiYWNrOiAoZXJyb3I/OiBFcnJvciB8IG51bGwpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLnN0cmVhbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICByZXR1cm4gdGhpcy5zdHJlYW0uZW5kKGNhbGxiYWNrKVxuICAgICAgfVxuXG4gICAgICBjYWxsYmFjaygpXG4gICB9XG59Il19