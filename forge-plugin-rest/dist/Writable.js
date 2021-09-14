"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestWritableStream = void 0;
const readable_stream_1 = require("readable-stream");
const got_1 = __importDefault(require("got"));
class RestWritableStream extends readable_stream_1.Writable {
    constructor(options) {
        super();
        if (this.options.requests.length == 0 ||
            this.options.requests.length > 1) {
            throw new Error(`One request is expected when writing to a URL`);
        }
        this.options = options;
    }
    _write(chunk, encoding, cb) {
        // For write, we expect to have 1 item in the requests Array
        let verb = this.options.requests[0].verb;
        let path = this.options.requests[0].path;
        got_1.default[verb](`${this.options.url}/${path}`, Object.assign({ body: chunk }, this.options.gotOptions))
            .then(res => {
            if (this.options.debug) {
                console.dir(res.body, { depth: null });
            }
            this.write(res.body);
            cb();
        })
            .catch(err => {
            cb(err);
        });
    }
}
exports.RestWritableStream = RestWritableStream;
//# sourceMappingURL=Writable.js.map