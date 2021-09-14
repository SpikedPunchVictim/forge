"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteToManyStream = void 0;
const readable_stream_1 = require("readable-stream");
const MultiError_1 = require("../errors/MultiError");
/**
 * A WriteStream that can stream data between multiple
 * WriteStreams
 */
class WriteToManyStream extends readable_stream_1.Writable {
    constructor(streams, options, maxWriteAttempts = 5) {
        super(options);
        this.streams = streams;
        this.maxWriteAttempts = maxWriteAttempts;
        // Flush the underlying streams when this stream is done
        let self = this;
        this.on('finish', () => {
            for (let stream of self.streams) {
                stream.end();
            }
        });
    }
    _write(chunk, encoding, callback) {
        let attemptCount = new Map();
        let doneCount = 0;
        let multi = new MultiError_1.MultiError();
        let cb = (error) => {
            // When an error occurs, we wait until
            // all of the streams are done processing
            // this request.
            if (error) {
                multi.errors.push(error);
            }
            doneCount++;
            if (doneCount == this.streams.length) {
                if (multi.length > 0) {
                    callback(multi);
                }
                else {
                    callback();
                }
            }
        };
        let drain = (stream) => {
            attemptWrite(stream);
        };
        let attemptWrite = (stream) => {
            let count = attemptCount.get(stream);
            if (count === undefined) {
                attemptCount.set(stream, 1);
            }
            else {
                attemptCount.set(stream, ++count);
            }
            if (stream.write(chunk, encoding, cb) == false) {
                stream.once('drain', () => drain(stream));
            }
        };
        for (let stream of this.streams) {
            attemptWrite(stream);
        }
    }
}
exports.WriteToManyStream = WriteToManyStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV3JpdGVUb01hbnlTdHJlYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RyZWFtcy9Xcml0ZVRvTWFueVN0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxREFBMkQ7QUFDM0QscURBQWlEO0FBRWpEOzs7R0FHRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsMEJBQVE7SUFJNUMsWUFBWSxPQUFtQixFQUFFLE9BQXlCLEVBQUUsbUJBQTJCLENBQUM7UUFDckYsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ2QsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFBO1FBRXhDLHdEQUF3RDtRQUN4RCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUE7UUFDZixJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDcEIsS0FBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUM3QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUE7YUFDZDtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFVLEVBQUUsUUFBZ0IsRUFBRSxRQUF3QztRQUMxRSxJQUFJLFlBQVksR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQTtRQUM5QyxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7UUFDakIsSUFBSSxLQUFLLEdBQWUsSUFBSSx1QkFBVSxFQUFFLENBQUE7UUFFeEMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxLQUFvQixFQUFFLEVBQUU7WUFDL0Isc0NBQXNDO1lBQ3RDLHlDQUF5QztZQUN6QyxnQkFBZ0I7WUFDaEIsSUFBRyxLQUFLLEVBQUU7Z0JBQ1AsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDMUI7WUFFRCxTQUFTLEVBQUUsQ0FBQTtZQUVYLElBQUcsU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUNsQyxJQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNsQixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7aUJBQ2pCO3FCQUFNO29CQUNKLFFBQVEsRUFBRSxDQUFBO2lCQUNaO2FBQ0g7UUFDSixDQUFDLENBQUE7UUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE1BQWdCLEVBQUUsRUFBRTtZQUM5QixZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDdkIsQ0FBQyxDQUFBO1FBRUQsSUFBSSxZQUFZLEdBQUcsQ0FBQyxNQUFnQixFQUFFLEVBQUU7WUFDckMsSUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUVwQyxJQUFHLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQ3JCLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFBO2FBQzdCO2lCQUFNO2dCQUNKLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7YUFDbkM7WUFFRCxJQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUU7Z0JBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO2FBQzNDO1FBQ0osQ0FBQyxDQUFBO1FBRUQsS0FBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzdCLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUN0QjtJQUNKLENBQUM7Q0FDSDtBQWhFRCw4Q0FnRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBXcml0YWJsZSwgV3JpdGFibGVPcHRpb25zIH0gZnJvbSAncmVhZGFibGUtc3RyZWFtJ1xuaW1wb3J0IHsgTXVsdGlFcnJvciB9IGZyb20gJy4uL2Vycm9ycy9NdWx0aUVycm9yJ1xuXG4vKipcbiAqIEEgV3JpdGVTdHJlYW0gdGhhdCBjYW4gc3RyZWFtIGRhdGEgYmV0d2VlbiBtdWx0aXBsZVxuICogV3JpdGVTdHJlYW1zXG4gKi9cbmV4cG9ydCBjbGFzcyBXcml0ZVRvTWFueVN0cmVhbSBleHRlbmRzIFdyaXRhYmxlIHtcbiAgIHJlYWRvbmx5IHN0cmVhbXM6IFdyaXRhYmxlW11cbiAgIHJlYWRvbmx5IG1heFdyaXRlQXR0ZW1wdHM6IG51bWJlclxuXG4gICBjb25zdHJ1Y3RvcihzdHJlYW1zOiBXcml0YWJsZVtdLCBvcHRpb25zPzogV3JpdGFibGVPcHRpb25zLCBtYXhXcml0ZUF0dGVtcHRzOiBudW1iZXIgPSA1KSB7XG4gICAgICBzdXBlcihvcHRpb25zKVxuICAgICAgdGhpcy5zdHJlYW1zID0gc3RyZWFtc1xuICAgICAgdGhpcy5tYXhXcml0ZUF0dGVtcHRzID0gbWF4V3JpdGVBdHRlbXB0c1xuXG4gICAgICAvLyBGbHVzaCB0aGUgdW5kZXJseWluZyBzdHJlYW1zIHdoZW4gdGhpcyBzdHJlYW0gaXMgZG9uZVxuICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICB0aGlzLm9uKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgICAgICBmb3IobGV0IHN0cmVhbSBvZiBzZWxmLnN0cmVhbXMpIHtcbiAgICAgICAgICAgIHN0cmVhbS5lbmQoKVxuICAgICAgICAgfVxuICAgICAgfSlcbiAgIH1cblxuICAgX3dyaXRlKGNodW5rOiBhbnksIGVuY29kaW5nOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I/OiBFcnJvciB8IG51bGwpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgIGxldCBhdHRlbXB0Q291bnQgPSBuZXcgTWFwPFdyaXRhYmxlLCBudW1iZXI+KClcbiAgICAgIGxldCBkb25lQ291bnQgPSAwXG4gICAgICBsZXQgbXVsdGk6IE11bHRpRXJyb3IgPSBuZXcgTXVsdGlFcnJvcigpXG5cbiAgICAgIGxldCBjYiA9IChlcnJvcj86IEVycm9yIHwgbnVsbCkgPT4ge1xuICAgICAgICAgLy8gV2hlbiBhbiBlcnJvciBvY2N1cnMsIHdlIHdhaXQgdW50aWxcbiAgICAgICAgIC8vIGFsbCBvZiB0aGUgc3RyZWFtcyBhcmUgZG9uZSBwcm9jZXNzaW5nXG4gICAgICAgICAvLyB0aGlzIHJlcXVlc3QuXG4gICAgICAgICBpZihlcnJvcikge1xuICAgICAgICAgICAgbXVsdGkuZXJyb3JzLnB1c2goZXJyb3IpXG4gICAgICAgICB9XG5cbiAgICAgICAgIGRvbmVDb3VudCsrXG5cbiAgICAgICAgIGlmKGRvbmVDb3VudCA9PSB0aGlzLnN0cmVhbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZihtdWx0aS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICBjYWxsYmFjayhtdWx0aSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBkcmFpbiA9IChzdHJlYW06IFdyaXRhYmxlKSA9PiB7XG4gICAgICAgICBhdHRlbXB0V3JpdGUoc3RyZWFtKVxuICAgICAgfVxuXG4gICAgICBsZXQgYXR0ZW1wdFdyaXRlID0gKHN0cmVhbTogV3JpdGFibGUpID0+IHtcbiAgICAgICAgIGxldCBjb3VudCA9IGF0dGVtcHRDb3VudC5nZXQoc3RyZWFtKVxuXG4gICAgICAgICBpZihjb3VudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhdHRlbXB0Q291bnQuc2V0KHN0cmVhbSwgMSlcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRlbXB0Q291bnQuc2V0KHN0cmVhbSwgKytjb3VudClcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYoc3RyZWFtLndyaXRlKGNodW5rLCBlbmNvZGluZywgY2IpID09IGZhbHNlKSB7XG4gICAgICAgICAgICBzdHJlYW0ub25jZSgnZHJhaW4nLCAoKSA9PiBkcmFpbihzdHJlYW0pKVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IobGV0IHN0cmVhbSBvZiB0aGlzLnN0cmVhbXMpIHtcbiAgICAgICAgIGF0dGVtcHRXcml0ZShzdHJlYW0pXG4gICAgICB9XG4gICB9XG59Il19