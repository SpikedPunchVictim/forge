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
exports.SwigPlugin = exports.SwigEnvoy = void 0;
const swig_1 = require("swig");
const Transform_1 = require("./Transform");
const SwigPluginOptions_1 = require("./SwigPluginOptions");
class SwigEnvoy {
    constructor(options) {
        this.options = options;
        this.swig = new swig_1.Swig(this.options.swigOptions);
    }
    /**
     * Creates a Swig object
     *
     * @param options The Swig Options
     */
    createSwig(options) {
        return new swig_1.Swig(options);
    }
    /**
     * Renders a string based on the SwigOptions that are set in the 'options' property.
     *
     * @param template The template string
     * @param data The data context
     */
    render(template, data) {
        return this.swig.render(template, Object.assign(Object.assign({}, this.options.swigOptions), { locals: data }));
    }
}
exports.SwigEnvoy = SwigEnvoy;
class SwigPlugin {
    constructor() {
        this.name = 'forge-swig-plugin';
    }
    // async createEnvoy(state: IBuildState, info: StepInfo): Promise<IEnvoy> {
    //    let options = await SwigPluginOptions.fromStep(state, info)
    //    return new SwigEnvoy(options)
    // }
    read(state, step) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Readable streams are not supported by the swig plugin');
        });
    }
    write(state, step) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = yield SwigPluginOptions_1.SwigPluginOptions.fromStep(state, step.info);
            return new Transform_1.SwigTransformStream(state, options);
        });
    }
    transform(state, step) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = yield SwigPluginOptions_1.SwigPluginOptions.fromStep(state, step.info);
            return new Transform_1.SwigTransformStream(state, options);
        });
    }
}
exports.SwigPlugin = SwigPlugin;
//# sourceMappingURL=Plugin.js.map