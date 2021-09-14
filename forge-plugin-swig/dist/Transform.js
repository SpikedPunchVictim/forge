"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwigTransformStream = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const readable_stream_1 = require("readable-stream");
const Plugin_1 = require("./Plugin");
// const swig = require('swig-templates')
// type DataContext = {
//    [key:string]: any
// }
/*

export class MultiSourceTransformStream extends MultiSourceStream {
   constructor() {

   }

   _transform(chunk, encoding, cb) {

   }
}

*/
class SwigTransformStream extends readable_stream_1.Transform {
    constructor(state, options) {
        super({
            defaultEncoding: 'utf8',
            objectMode: true
        });
        this.options = options;
        this.envoy = new Plugin_1.SwigEnvoy(options);
        this.state = state;
        this.cache = undefined;
    }
    _transform(chunk, encoding, cb) {
        // TODO: Support multiple use sources
        // To do that, spawn a transform stream for each use, and store their results into a Map
        if (chunk instanceof Uint8Array) {
            chunk = Buffer.from(chunk).toString('utf8');
            this.cache = this.cache === undefined ? chunk : (this.cache + chunk);
        }
        else if (Array.isArray(chunk)) {
            //@ts-ignore
            this.cache = this.cache == null ? Array.from(chunk) : this.cache.concat(chunk);
        }
        else if (this.cache === undefined) {
            this.cache = chunk;
        }
        else {
            this.cache += chunk;
        }
        cb(null, chunk);
    }
    _flush(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            let use = this.options.use || 'obj';
            try {
                let obj = {};
                if (Array.isArray(this.cache)) {
                    obj = this.cache;
                }
                else if (typeof this.cache === 'object') {
                    obj = this.cache;
                }
                else if (typeof this.cache === 'string') {
                    obj = JSON.parse(this.cache);
                }
                let rendered = this.options.compile({ [use]: obj }, this.options.swigOptions);
                if (this.options.outFile) {
                    yield fs.ensureDir(path.dirname(this.options.outFile));
                    yield fs.writeFile(this.options.outFile, rendered, 'utf8');
                }
                else if (this.options.outFiles) {
                    // (envoy: SwigEnvoy, state: IBuildState, data: any)
                    yield this.options.outFiles(this.envoy, this.state, this.cache);
                }
                cb(null, rendered);
            }
            catch (err) {
                cb(err);
            }
        });
    }
}
exports.SwigTransformStream = SwigTransformStream;
//# sourceMappingURL=Transform.js.map