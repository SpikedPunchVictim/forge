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
exports.SwigPluginOptions = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const swig_1 = require("swig");
class SwigPluginOptions {
    static fromStep(state, info) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = new SwigPluginOptions();
            if (info.template && info.templateFile) {
                throw new Error(`For the swig step, 'template' and 'templateFile' are mutually exclusive. Ensure only one of them exists.`);
            }
            let swig = new swig_1.Swig(info.options);
            options.swigOptions = info.options || {};
            options.swigOptions.autoescape = options.swigOptions.autoescape || false;
            options.use = info.use;
            if (info.templatFile) {
                if (typeof info.templatFile !== 'string') {
                    throw new Error(`In a swig step, expected 'templatFile' to be a string, but got ${typeof info.templatFile} instead.`);
                }
                let found = yield state.findFile(info.templateFile);
                if (found === undefined) {
                    throw new Error(`Unable to find the swig templatFile ${info.templatFile}. Ensure it exists, and that a 'resolve' has been set for it.`);
                }
                options.template = yield fs.readFile(found, 'utf8');
            }
            if (info.template) {
                if (typeof info.template !== 'string') {
                    throw new Error(`In a swig step, expected 'template' to be a string, but got ${typeof info.template} instead.`);
                }
                options.template = info.template;
            }
            if (info.outFile) {
                if (typeof info.outFile !== 'string') {
                    throw new Error(`In a swig step, expected 'outFile' to be a string, but got ${typeof info.outFile} instead.`);
                }
                options.outFile = path.join(state.cwd, info.outFile);
            }
            if (info.outFiles) {
                if (typeof info.outFiles !== 'string' || typeof info.outFiles !== 'function') {
                    throw new Error(`In a swig step, expected 'outFile' to be a string, but got ${typeof info.outFile} instead.`);
                }
                if (typeof info.outFiles === 'string') {
                    let filePath = yield state.findFile(info.outFiles);
                    if (filePath == null) {
                        throw new Error(`Could not find path to Swig 'outFiles' script ${info.outFiles}`);
                    }
                    options.outFiles = require(filePath);
                }
                if (typeof info.outFiles === 'function') {
                    options.outFiles = info.outFiles;
                }
            }
            options.compile = swig.compile(info.template, options.swigOptions);
            return options;
        });
    }
}
exports.SwigPluginOptions = SwigPluginOptions;
//# sourceMappingURL=SwigPluginOptions.js.map