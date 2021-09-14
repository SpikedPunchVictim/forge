"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestOptions = void 0;
const Utils_1 = require("./Utils");
class RestOptions {
    constructor() {
        this.json = false;
        this.debug = false;
        this.requests = new Array();
        this.gotOptions = {};
    }
    static fromStep(url, info, gotOptions) {
        let options = new RestOptions();
        options.url = url == null ? undefined : url;
        options.json = info.json || false;
        options.debug = info.debug || false;
        if (info.verb || info.path) {
            //@ts-ignore
            validateRequestEntry(info);
            options.requests.push({
                verb: Utils_1.toRestVerb(info.verb),
                path: info.path
            });
        }
        if (info.requests) {
            if (!Array.isArray(info.requests)) {
                throw new Error(`The 'requests' field in a Rest step is expected to be an Array, but instead got ${typeof info.requests}`);
            }
            for (let req of info.requests) {
                validateRequestEntry(req);
            }
            options.requests = info.requests;
        }
        gotOptions = gotOptions || {};
        options.gotOptions = options.gotOptions || {};
        options.gotOptions = Object.assign(Object.assign({}, gotOptions), options.gotOptions);
        return options;
    }
}
exports.RestOptions = RestOptions;
function validateRequestEntry(entry) {
    if (entry.verb == null) {
        throw new Error(`Missing the 'verb' field. The 'verb' field in a Rest step must exist if a 'path' is provided.`);
    }
    if (entry.path == null) {
        throw new Error(`Missing the 'path' field. The 'path' field in a Rest step must exist if a 'verb' is provided.`);
    }
    if (typeof entry.verb !== 'string') {
        throw new Error(`The 'verb' field in a Rest Step is incorrect. Expecting a 'string', but instead got ${typeof entry.verb}`);
    }
    if (typeof entry.path !== 'string') {
        throw new Error(`The 'path' field in a Rest Step is incorrect. Expecting a 'string', but instead got ${typeof entry.path}`);
    }
}
//# sourceMappingURL=RestOptions.js.map