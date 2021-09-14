"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonPlugin = exports.StreamMode = void 0;
const Readable_1 = require("./Readable");
const Writable_1 = require("./Writable");
const JsonStreamOptions_1 = require("./JsonStreamOptions");
const Transform_1 = require("./Transform");
var StreamMode;
(function (StreamMode) {
    StreamMode[StreamMode["Object"] = 0] = "Object";
    StreamMode[StreamMode["Sax"] = 1] = "Sax";
    StreamMode[StreamMode["Chunk"] = 2] = "Chunk";
})(StreamMode = exports.StreamMode || (exports.StreamMode = {}));
/**
 *
 */
class JsonPlugin {
    constructor() {
        this.name = 'forge-plugin-json';
    }
    // async createEnvoy(state: IBuildState, info: StepInfo): Promise<IEnvoy> {
    //    let options = await JsonStreamOptions.fromStep(state, info)
    //    return new JsonEnvoy(options)
    // }
    async read(state, step) {
        let options = await JsonStreamOptions_1.JsonStreamOptions.fromStep(state, step.info);
        switch (options.mode) {
            case StreamMode.Chunk: {
                return new Readable_1.JsonChunkReadStream(options.files);
            }
            case StreamMode.Object: {
                return new Readable_1.JsonObjectReadStream(options.files);
            }
            case StreamMode.Sax: {
                return new Readable_1.JsonSaxReadStream(options.files);
            }
            default: {
                throw new Error(`Unsupported 'mode' encoutnered when processing a JSON step.`);
            }
        }
    }
    async write(state, step) {
        let options = await JsonStreamOptions_1.JsonStreamOptions.fromStep(state, step.info);
        return new Writable_1.JsonWritableStream(options.outFile);
    }
    async transform(state, step) {
        let options = await JsonStreamOptions_1.JsonStreamOptions.fromStep(state, step.info);
        return new Transform_1.JsonTransformStream(options.outFile);
    }
}
exports.JsonPlugin = JsonPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQSx5Q0FBeUY7QUFDekYseUNBQStDO0FBQy9DLDJEQUF1RDtBQUN2RCwyQ0FBaUQ7QUFFakQsSUFBWSxVQUlYO0FBSkQsV0FBWSxVQUFVO0lBQ25CLCtDQUFVLENBQUE7SUFDVix5Q0FBTyxDQUFBO0lBQ1AsNkNBQVMsQ0FBQTtBQUNaLENBQUMsRUFKVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQUlyQjtBQUVEOztHQUVHO0FBQ0gsTUFBYSxVQUFVO0lBR3BCO1FBRlMsU0FBSSxHQUFXLG1CQUFtQixDQUFBO0lBSTNDLENBQUM7SUFFRCwyRUFBMkU7SUFDM0UsaUVBQWlFO0lBQ2pFLG1DQUFtQztJQUNuQyxJQUFJO0lBRUosS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFrQixFQUFFLElBQVc7UUFDdkMsSUFBSSxPQUFPLEdBQUcsTUFBTSxxQ0FBaUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVoRSxRQUFRLE9BQU8sQ0FBQyxJQUFJLEVBQUU7WUFDbkIsS0FBSyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLE9BQU8sSUFBSSw4QkFBbUIsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDL0M7WUFDRCxLQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckIsT0FBTyxJQUFJLCtCQUFvQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUNoRDtZQUNELEtBQUssVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixPQUFPLElBQUksNEJBQWlCLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQzdDO1lBQ0QsT0FBTyxDQUFDLENBQUM7Z0JBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsQ0FBQyxDQUFBO2FBQ2hGO1NBQ0g7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFrQixFQUFFLElBQVc7UUFDeEMsSUFBSSxPQUFPLEdBQUcsTUFBTSxxQ0FBaUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNoRSxPQUFPLElBQUksNkJBQWtCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2pELENBQUM7SUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQWtCLEVBQUUsSUFBVztRQUM1QyxJQUFJLE9BQU8sR0FBRyxNQUFNLHFDQUFpQixDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2hFLE9BQU8sSUFBSSwrQkFBbUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDbEQsQ0FBQztDQUNIO0FBeENELGdDQXdDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICBJQnVpbGRTdGF0ZSxcbiAgIElQbHVnaW4sXG4gICBJU3RlcFxufSBmcm9tICdAc3Bpa2VkcHVuY2gvZm9yZ2UnXG5cbmltcG9ydCB7IFJlYWRhYmxlLCBXcml0YWJsZSwgVHJhbnNmb3JtIH0gZnJvbSAncmVhZGFibGUtc3RyZWFtJ1xuaW1wb3J0IHsgSnNvbkNodW5rUmVhZFN0cmVhbSwgSnNvbk9iamVjdFJlYWRTdHJlYW0sIEpzb25TYXhSZWFkU3RyZWFtIH0gZnJvbSAnLi9SZWFkYWJsZSdcbmltcG9ydCB7IEpzb25Xcml0YWJsZVN0cmVhbSB9IGZyb20gJy4vV3JpdGFibGUnXG5pbXBvcnQgeyBKc29uU3RyZWFtT3B0aW9ucyB9IGZyb20gJy4vSnNvblN0cmVhbU9wdGlvbnMnXG5pbXBvcnQgeyBKc29uVHJhbnNmb3JtU3RyZWFtIH0gZnJvbSAnLi9UcmFuc2Zvcm0nXG5cbmV4cG9ydCBlbnVtIFN0cmVhbU1vZGUge1xuICAgT2JqZWN0ID0gMCxcbiAgIFNheCA9IDEsXG4gICBDaHVuayA9IDJcbn1cblxuLyoqXG4gKiBcbiAqL1xuZXhwb3J0IGNsYXNzIEpzb25QbHVnaW4gaW1wbGVtZW50cyBJUGx1Z2luIHtcbiAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZyA9ICdmb3JnZS1wbHVnaW4tanNvbidcblxuICAgY29uc3RydWN0b3IoKSB7XG5cbiAgIH1cblxuICAgLy8gYXN5bmMgY3JlYXRlRW52b3koc3RhdGU6IElCdWlsZFN0YXRlLCBpbmZvOiBTdGVwSW5mbyk6IFByb21pc2U8SUVudm95PiB7XG4gICAvLyAgICBsZXQgb3B0aW9ucyA9IGF3YWl0IEpzb25TdHJlYW1PcHRpb25zLmZyb21TdGVwKHN0YXRlLCBpbmZvKVxuICAgLy8gICAgcmV0dXJuIG5ldyBKc29uRW52b3kob3B0aW9ucylcbiAgIC8vIH1cblxuICAgYXN5bmMgcmVhZChzdGF0ZTogSUJ1aWxkU3RhdGUsIHN0ZXA6IElTdGVwKTogUHJvbWlzZTxSZWFkYWJsZT4ge1xuICAgICAgbGV0IG9wdGlvbnMgPSBhd2FpdCBKc29uU3RyZWFtT3B0aW9ucy5mcm9tU3RlcChzdGF0ZSwgc3RlcC5pbmZvKVxuXG4gICAgICBzd2l0Y2ggKG9wdGlvbnMubW9kZSkge1xuICAgICAgICAgY2FzZSBTdHJlYW1Nb2RlLkNodW5rOiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEpzb25DaHVua1JlYWRTdHJlYW0ob3B0aW9ucy5maWxlcylcbiAgICAgICAgIH1cbiAgICAgICAgIGNhc2UgU3RyZWFtTW9kZS5PYmplY3Q6IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgSnNvbk9iamVjdFJlYWRTdHJlYW0ob3B0aW9ucy5maWxlcylcbiAgICAgICAgIH1cbiAgICAgICAgIGNhc2UgU3RyZWFtTW9kZS5TYXg6IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgSnNvblNheFJlYWRTdHJlYW0ob3B0aW9ucy5maWxlcylcbiAgICAgICAgIH1cbiAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgJ21vZGUnIGVuY291dG5lcmVkIHdoZW4gcHJvY2Vzc2luZyBhIEpTT04gc3RlcC5gKVxuICAgICAgICAgfVxuICAgICAgfVxuICAgfVxuXG4gICBhc3luYyB3cml0ZShzdGF0ZTogSUJ1aWxkU3RhdGUsIHN0ZXA6IElTdGVwKTogUHJvbWlzZTxXcml0YWJsZT4ge1xuICAgICAgbGV0IG9wdGlvbnMgPSBhd2FpdCBKc29uU3RyZWFtT3B0aW9ucy5mcm9tU3RlcChzdGF0ZSwgc3RlcC5pbmZvKVxuICAgICAgcmV0dXJuIG5ldyBKc29uV3JpdGFibGVTdHJlYW0ob3B0aW9ucy5vdXRGaWxlKVxuICAgfVxuXG4gICBhc3luYyB0cmFuc2Zvcm0oc3RhdGU6IElCdWlsZFN0YXRlLCBzdGVwOiBJU3RlcCk6IFByb21pc2U8VHJhbnNmb3JtPiB7XG4gICAgICBsZXQgb3B0aW9ucyA9IGF3YWl0IEpzb25TdHJlYW1PcHRpb25zLmZyb21TdGVwKHN0YXRlLCBzdGVwLmluZm8pXG4gICAgICByZXR1cm4gbmV3IEpzb25UcmFuc2Zvcm1TdHJlYW0ob3B0aW9ucy5vdXRGaWxlKVxuICAgfVxufSJdfQ==