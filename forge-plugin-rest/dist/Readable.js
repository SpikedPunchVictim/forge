"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestReadableStream = void 0;
const readable_stream_1 = require("readable-stream");
const got_1 = __importDefault(require("got"));
class RestReadableStream extends readable_stream_1.Readable {
    constructor(options) {
        super({
            encoding: 'utf8'
        });
        this.options = options;
    }
    _read() {
        try {
            let req = this.options.requests.shift();
            if (req === undefined) {
                this.push(null);
                return;
            }
            // trim forward slashes
            while (req.path.startsWith('/')) {
                req.path = req.path.slice(1);
            }
            let uri = this.options.url === undefined ?
                req.path :
                `${this.options.url}/${req.path}`;
            got_1.default[req.verb](uri, this.options.gotOptions)
                .then(res => {
                if (this.options.debug) {
                    console.dir(res.body, { depth: null });
                }
                this.push(res.body);
            })
                .catch(err => {
                this.destroy(err);
            });
        }
        catch (err) {
            this.destroy(err);
        }
    }
}
exports.RestReadableStream = RestReadableStream;
//# sourceMappingURL=Readable.js.map