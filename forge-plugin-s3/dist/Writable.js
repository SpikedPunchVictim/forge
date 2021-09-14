"use strict";
/*
abortMultipartUpload
createMultipartUpload
completeMultipartUpload
uploadPart
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3WritableStream = void 0;
const readable_stream_1 = require("readable-stream");
const aws_sdk_1 = require("aws-sdk");
class S3WritableStream extends readable_stream_1.Writable {
    constructor(stepOptions, options) {
        super({
            highWaterMark: 8388608,
            ...(options || {})
        });
        this.promise = undefined;
        this.options = stepOptions;
        this.s3 = new aws_sdk_1.S3({
            credentials: new aws_sdk_1.Credentials({
                accessKeyId: this.options.accessKeyId || '',
                secretAccessKey: this.options.secretAccessKey || ''
            })
        });
    }
    _write(chunk, encoding, callback) {
        try {
            let attemptCount = 0;
            if (this.stream === undefined) {
                this.stream = new readable_stream_1.PassThrough();
                this.stream.on('close', () => this.emit('close'));
                this.stream.on('error', (err) => this.emit('error', err));
                let s3Options = this.options.s3Options || {};
                this.promise = this.s3.upload({
                    Bucket: this.options.bucket,
                    Key: this.options.key,
                    Body: this.stream,
                    ...s3Options
                }).promise();
            }
            let cb = (error) => {
                // When an error occurs, we wait until
                // all of the streams are done processing
                // this request.
                if (error) {
                    callback(error);
                }
                else {
                    callback();
                }
            };
            let drain = (stream) => {
                attemptWrite(stream);
            };
            let attemptWrite = (stream) => {
                ++attemptCount;
                if (attemptCount > 5) {
                    return callback(new Error(`Too many attempts performed while retrying to write to the S3 bucket. Step with S3 bucket key ${this.options.key}`));
                }
                // This should never happen. It helps appease the Typescript Gods
                if (this.stream == undefined) {
                    return callback(new Error(`Internal S3 writable stream failed to initialize for step with S3 bucket key ${this.options.key}`));
                }
                if (this.stream.write(chunk, cb) == false) {
                    stream.once('drain', () => drain(stream));
                }
            };
            attemptWrite(this.stream);
        }
        catch (err) {
            callback(err);
        }
    }
    async _final(cb) {
        var _a;
        if (this.promise === undefined) {
            return cb();
        }
        (_a = this.stream) === null || _a === void 0 ? void 0 : _a.end();
        await this.promise;
        cb();
    }
}
exports.S3WritableStream = S3WritableStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV3JpdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvV3JpdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztFQUtFOzs7QUFFRixxREFBeUU7QUFDekUscUNBQXlDO0FBR3pDLE1BQWEsZ0JBQWlCLFNBQVEsMEJBQVE7SUFNM0MsWUFBWSxXQUEwQixFQUFFLE9BQXlCO1FBQzlELEtBQUssQ0FBQztZQUNILGFBQWEsRUFBRSxPQUFPO1lBQ3RCLEdBQUcsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1NBQ3BCLENBQUMsQ0FBQTtRQU5HLFlBQU8sR0FBbUQsU0FBUyxDQUFBO1FBUXhFLElBQUksQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFBO1FBRTFCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUM7WUFDZCxXQUFXLEVBQUUsSUFBSSxxQkFBVyxDQUFDO2dCQUMxQixXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksRUFBRTtnQkFDM0MsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxJQUFJLEVBQUU7YUFDckQsQ0FBQztTQUNKLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBVSxFQUFFLFFBQWdCLEVBQUUsUUFBd0M7UUFDMUUsSUFBSTtZQUNELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQTtZQUVwQixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksNkJBQVcsRUFBRSxDQUFBO2dCQUUvQixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO2dCQUNqRCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7Z0JBRXpELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQTtnQkFFNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQztvQkFDM0IsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtvQkFDM0IsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztvQkFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNO29CQUNqQixHQUFHLFNBQVM7aUJBQ2QsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO2FBQ2Q7WUFFRCxJQUFJLEVBQUUsR0FBRyxDQUFDLEtBQW9CLEVBQUUsRUFBRTtnQkFDL0Isc0NBQXNDO2dCQUN0Qyx5Q0FBeUM7Z0JBQ3pDLGdCQUFnQjtnQkFDaEIsSUFBSSxLQUFLLEVBQUU7b0JBQ1IsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO2lCQUNqQjtxQkFBTTtvQkFDSixRQUFRLEVBQUUsQ0FBQTtpQkFDWjtZQUNKLENBQUMsQ0FBQTtZQUVELElBQUksS0FBSyxHQUFHLENBQUMsTUFBZ0IsRUFBRSxFQUFFO2dCQUM5QixZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDdkIsQ0FBQyxDQUFBO1lBRUQsSUFBSSxZQUFZLEdBQUcsQ0FBQyxNQUFnQixFQUFFLEVBQUU7Z0JBQ3JDLEVBQUUsWUFBWSxDQUFBO2dCQUVkLElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtvQkFDbkIsT0FBTyxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsaUdBQWlHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO2lCQUNqSjtnQkFFRCxpRUFBaUU7Z0JBQ2pFLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxTQUFTLEVBQUU7b0JBQzNCLE9BQU8sUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLGdGQUFnRixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtpQkFDaEk7Z0JBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFO29CQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtpQkFDM0M7WUFDSixDQUFDLENBQUE7WUFFRCxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQzNCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWCxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDZjtJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQWtDOztRQUM1QyxJQUFHLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQzVCLE9BQU8sRUFBRSxFQUFFLENBQUE7U0FDYjtRQUVELE1BQUEsSUFBSSxDQUFDLE1BQU0sMENBQUUsR0FBRyxHQUFFO1FBQ2xCLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQTtRQUNsQixFQUFFLEVBQUUsQ0FBQTtJQUNQLENBQUM7Q0FDSDtBQXpGRCw0Q0F5RkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuYWJvcnRNdWx0aXBhcnRVcGxvYWRcbmNyZWF0ZU11bHRpcGFydFVwbG9hZFxuY29tcGxldGVNdWx0aXBhcnRVcGxvYWRcbnVwbG9hZFBhcnRcbiovXG5cbmltcG9ydCB7IFBhc3NUaHJvdWdoLCBXcml0YWJsZSwgV3JpdGFibGVPcHRpb25zIH0gZnJvbSBcInJlYWRhYmxlLXN0cmVhbVwiO1xuaW1wb3J0IHsgQ3JlZGVudGlhbHMsIFMzIH0gZnJvbSAnYXdzLXNkaydcbmltcG9ydCB7IFMzU3RlcE9wdGlvbnMgfSBmcm9tIFwiLi9TM1N0ZXBPcHRpb25zXCI7XG5cbmV4cG9ydCBjbGFzcyBTM1dyaXRhYmxlU3RyZWFtIGV4dGVuZHMgV3JpdGFibGUge1xuICAgcmVhZG9ubHkgb3B0aW9uczogUzNTdGVwT3B0aW9uc1xuICAgcHJpdmF0ZSBzdHJlYW06IFBhc3NUaHJvdWdoIHwgdW5kZWZpbmVkXG4gICBwcml2YXRlIHMzOiBTM1xuICAgcHJpdmF0ZSBwcm9taXNlOiBQcm9taXNlPFMzLk1hbmFnZWRVcGxvYWQuU2VuZERhdGE+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgIGNvbnN0cnVjdG9yKHN0ZXBPcHRpb25zOiBTM1N0ZXBPcHRpb25zLCBvcHRpb25zPzogV3JpdGFibGVPcHRpb25zKSB7XG4gICAgICBzdXBlcih7XG4gICAgICAgICBoaWdoV2F0ZXJNYXJrOiA4Mzg4NjA4LCAvLyA4TUJcbiAgICAgICAgIC4uLihvcHRpb25zIHx8IHt9KVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vcHRpb25zID0gc3RlcE9wdGlvbnNcblxuICAgICAgdGhpcy5zMyA9IG5ldyBTMyh7XG4gICAgICAgICBjcmVkZW50aWFsczogbmV3IENyZWRlbnRpYWxzKHtcbiAgICAgICAgICAgIGFjY2Vzc0tleUlkOiB0aGlzLm9wdGlvbnMuYWNjZXNzS2V5SWQgfHwgJycsXG4gICAgICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IHRoaXMub3B0aW9ucy5zZWNyZXRBY2Nlc3NLZXkgfHwgJydcbiAgICAgICAgIH0pXG4gICAgICB9KVxuICAgfVxuXG4gICBfd3JpdGUoY2h1bms6IGFueSwgZW5jb2Rpbmc6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcj86IEVycm9yIHwgbnVsbCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgdHJ5IHtcbiAgICAgICAgIGxldCBhdHRlbXB0Q291bnQgPSAwXG5cbiAgICAgICAgIGlmICh0aGlzLnN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnN0cmVhbSA9IG5ldyBQYXNzVGhyb3VnaCgpXG5cbiAgICAgICAgICAgIHRoaXMuc3RyZWFtLm9uKCdjbG9zZScsICgpID0+IHRoaXMuZW1pdCgnY2xvc2UnKSlcbiAgICAgICAgICAgIHRoaXMuc3RyZWFtLm9uKCdlcnJvcicsIChlcnIpID0+IHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpKVxuXG4gICAgICAgICAgICBsZXQgczNPcHRpb25zID0gdGhpcy5vcHRpb25zLnMzT3B0aW9ucyB8fCB7fVxuXG4gICAgICAgICAgICB0aGlzLnByb21pc2UgPSB0aGlzLnMzLnVwbG9hZCh7XG4gICAgICAgICAgICAgICBCdWNrZXQ6IHRoaXMub3B0aW9ucy5idWNrZXQsXG4gICAgICAgICAgICAgICBLZXk6IHRoaXMub3B0aW9ucy5rZXksXG4gICAgICAgICAgICAgICBCb2R5OiB0aGlzLnN0cmVhbSxcbiAgICAgICAgICAgICAgIC4uLnMzT3B0aW9uc1xuICAgICAgICAgICAgfSkucHJvbWlzZSgpXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBjYiA9IChlcnJvcj86IEVycm9yIHwgbnVsbCkgPT4ge1xuICAgICAgICAgICAgLy8gV2hlbiBhbiBlcnJvciBvY2N1cnMsIHdlIHdhaXQgdW50aWxcbiAgICAgICAgICAgIC8vIGFsbCBvZiB0aGUgc3RyZWFtcyBhcmUgZG9uZSBwcm9jZXNzaW5nXG4gICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QuXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IGRyYWluID0gKHN0cmVhbTogV3JpdGFibGUpID0+IHtcbiAgICAgICAgICAgIGF0dGVtcHRXcml0ZShzdHJlYW0pXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBhdHRlbXB0V3JpdGUgPSAoc3RyZWFtOiBXcml0YWJsZSkgPT4ge1xuICAgICAgICAgICAgKythdHRlbXB0Q291bnRcblxuICAgICAgICAgICAgaWYgKGF0dGVtcHRDb3VudCA+IDUpIHtcbiAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoYFRvbyBtYW55IGF0dGVtcHRzIHBlcmZvcm1lZCB3aGlsZSByZXRyeWluZyB0byB3cml0ZSB0byB0aGUgUzMgYnVja2V0LiBTdGVwIHdpdGggUzMgYnVja2V0IGtleSAke3RoaXMub3B0aW9ucy5rZXl9YCkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoaXMgc2hvdWxkIG5ldmVyIGhhcHBlbi4gSXQgaGVscHMgYXBwZWFzZSB0aGUgVHlwZXNjcmlwdCBHb2RzXG4gICAgICAgICAgICBpZiAodGhpcy5zdHJlYW0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKGBJbnRlcm5hbCBTMyB3cml0YWJsZSBzdHJlYW0gZmFpbGVkIHRvIGluaXRpYWxpemUgZm9yIHN0ZXAgd2l0aCBTMyBidWNrZXQga2V5ICR7dGhpcy5vcHRpb25zLmtleX1gKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc3RyZWFtLndyaXRlKGNodW5rLCBjYikgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgIHN0cmVhbS5vbmNlKCdkcmFpbicsICgpID0+IGRyYWluKHN0cmVhbSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIGF0dGVtcHRXcml0ZSh0aGlzLnN0cmVhbSlcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgY2FsbGJhY2soZXJyKVxuICAgICAgfVxuICAgfVxuXG4gICBhc3luYyBfZmluYWwoY2I6IChlcnJvcj86IEVycm9yIHwgbnVsbCkgPT4gdm9pZCkge1xuICAgICAgaWYodGhpcy5wcm9taXNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHJldHVybiBjYigpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RyZWFtPy5lbmQoKVxuICAgICAgYXdhaXQgdGhpcy5wcm9taXNlXG4gICAgICBjYigpXG4gICB9XG59Il19