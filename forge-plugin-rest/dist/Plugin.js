"use strict";
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
exports.RestPlugin = exports.RestEnvoy = void 0;
const Readable_1 = require("./Readable");
const Writable_1 = require("./Writable");
const RestOptions_1 = require("./RestOptions");
const Utils_1 = require("./Utils");
class RestEnvoy {
    constructor(options) {
        this.url = Utils_1.sanitizeUrl(options.url);
    }
}
exports.RestEnvoy = RestEnvoy;
class RestPlugin {
    constructor(url, options) {
        this.name = 'forge-plugin-rest';
        this.url = url == null ? undefined : Utils_1.sanitizeUrl(url);
        this.options = options || {};
    }
    // async createEnvoy(state: IBuildState, info: StepInfo): Promise<IEnvoy> {
    //    let options = RestOptions.fromStep(this.url, info, this.options.gotOptions)
    //    return new RestEnvoy(options)
    // }
    read(state, step) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = RestOptions_1.RestOptions.fromStep(this.url, step.info, this.options.gotOptions);
            return new Readable_1.RestReadableStream(options);
        });
    }
    write(state, step) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = RestOptions_1.RestOptions.fromStep(this.url, step.info, this.options.gotOptions);
            return new Writable_1.RestWritableStream(options);
        });
    }
    transform(state, step) {
        throw new Error(`Method not implemented. alias: ${step.alias}`);
    }
}
exports.RestPlugin = RestPlugin;
//# sourceMappingURL=Plugin.js.map