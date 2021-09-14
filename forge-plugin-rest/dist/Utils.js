"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUrl = exports.toRestVerb = exports.RestVerb = void 0;
var RestVerb;
(function (RestVerb) {
    RestVerb["Delete"] = "delete";
    RestVerb["Get"] = "get";
    RestVerb["Head"] = "head";
    RestVerb["Patch"] = "patch";
    RestVerb["Post"] = "post";
    RestVerb["Put"] = "put";
})(RestVerb = exports.RestVerb || (exports.RestVerb = {}));
function toRestVerb(verb) {
    let lower = verb.toLowerCase();
    for (let en of Object.keys(RestVerb)) {
        if (en.toLowerCase() === lower) {
            return RestVerb[en];
        }
    }
    throw new Error(`Unsupported verb ${verb}`);
}
exports.toRestVerb = toRestVerb;
function sanitizeUrl(url) {
    // Strip off following '/'
    if (url.endsWith('/')) {
        while (url.endsWith('/')) {
            url = url.slice(-1);
        }
    }
    return url;
}
exports.sanitizeUrl = sanitizeUrl;
//# sourceMappingURL=Utils.js.map