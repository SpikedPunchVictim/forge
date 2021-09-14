"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeBuilder = void 0;
const BuildRecord_1 = require("./BuildRecord");
const BuildState_1 = require("./BuildState");
const Logger_1 = require("../utils/Logger");
const Pipeline_1 = require("./Pipeline");
const events_1 = require("events");
/*-----------------------------------------------------------------------*
 * This class represents the logic and state containment for building
 * forge projects
 *----------------------------------------------------------------------*/
class ForgeBuilder extends events_1.EventEmitter {
    constructor(config, options) {
        super();
        this.forgeConfig = config;
        this.options = options;
        this.pipelineToStateMap = new Map();
    }
    get pipelines() {
        return this.forgeConfig.pipelines || [];
    }
    get plugins() {
        return this.forgeConfig.plugins;
    }
    reset() {
        this.pipelineToStateMap.clear();
    }
    get logger() {
        return this.options.logger || Logger_1.EmptyLogger;
    }
    /**
     * Builds all of the projects. The entire build process is tracked
     * through a BuildRecord. This contains each stage's vaults, as well
     * as data associated with each stage of a build.
     */
    async build() {
        this.reset();
        let record = new BuildRecord_1.BuildRecord(this.pipelines);
        // Serially import
        for (let pipeline of this.pipelines) {
            await this.buildPipeline(pipeline, record);
        }
        return record;
    }
    async buildPipeline(pipeline, record) {
        //let start = elapsedTime()
        let state = new BuildState_1.BuildState(pipeline, record, this.options);
        record.vaults.set(pipeline.name, state.vault);
        await this.runPipelineScript(pipeline, 'beforeRun', [state]);
        let pline = Pipeline_1.Pipeline.toPipeline(pipeline.steps);
        await pline.run(state);
        await this.runPipelineScript(pipeline, 'afterRun', [state]);
    }
    runPipelineScript(pipeline, scriptName, args) {
        return pipeline.script[scriptName] ?
            pipeline.script[scriptName](...args) :
            Promise.resolve();
    }
}
exports.ForgeBuilder = ForgeBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yZ2VCdWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvRm9yZ2VCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUEyQztBQUMzQyw2Q0FBc0Q7QUFJdEQsNENBQXNEO0FBQ3RELHlDQUFxQztBQUNyQyxtQ0FBcUM7QUFHckM7OzswRUFHMEU7QUFDMUUsTUFBYSxZQUFhLFNBQVEscUJBQVk7SUFLM0MsWUFBWSxNQUFtQixFQUFFLE9BQXFCO1FBQ25ELEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUE7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksR0FBRyxFQUErQixDQUFBO0lBQ25FLENBQUM7SUFFRCxJQUFXLFNBQVM7UUFDakIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUE7SUFDMUMsQ0FBQztJQUVELElBQVcsT0FBTztRQUNmLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUE7SUFDbEMsQ0FBQztJQUVNLEtBQUs7UUFDVCxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDbEMsQ0FBQztJQUVELElBQVcsTUFBTTtRQUNkLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksb0JBQVcsQ0FBQTtJQUM1QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxLQUFLO1FBQ2YsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO1FBRVosSUFBSSxNQUFNLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUU1QyxrQkFBa0I7UUFDbEIsS0FBSyxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xDLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDNUM7UUFFRCxPQUFPLE1BQU0sQ0FBQTtJQUNoQixDQUFDO0lBRU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUF3QixFQUFFLE1BQW1CO1FBQ3RFLDJCQUEyQjtRQUMzQixJQUFJLEtBQUssR0FBRyxJQUFJLHVCQUFVLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFMUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFN0MsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7UUFFNUQsSUFBSSxLQUFLLEdBQUcsbUJBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQy9DLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUV0QixNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUM5RCxDQUFDO0lBRUQsaUJBQWlCLENBQUMsUUFBdUIsRUFBRSxVQUFrQixFQUFFLElBQWdCO1FBQzVFLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUN2QixDQUFDO0NBQ0g7QUFqRUQsb0NBaUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnVpbGRSZWNvcmQgfSBmcm9tICcuL0J1aWxkUmVjb3JkJ1xuaW1wb3J0IHsgQnVpbGRTdGF0ZSwgSUJ1aWxkU3RhdGUgfSBmcm9tICcuL0J1aWxkU3RhdGUnXG5pbXBvcnQgeyBGb3JnZUNvbmZpZywgRm9yZ2VPcHRpb25zIH0gZnJvbSAnLi9Gb3JnZU9wdGlvbnMnXG5pbXBvcnQgeyBOYW1lZFBsdWdpbiB9IGZyb20gJy4vTmFtZWRQbHVnaW4nXG5pbXBvcnQgeyBGb3JnZVBpcGVsaW5lLCBJRm9yZ2VQaXBlbGluZSB9IGZyb20gJy4vRm9yZ2VUcmFuc2Zvcm0nXG5pbXBvcnQgeyBFbXB0eUxvZ2dlciwgSUxvZ2dlciB9IGZyb20gJy4uL3V0aWxzL0xvZ2dlcidcbmltcG9ydCB7IFBpcGVsaW5lIH0gZnJvbSAnLi9QaXBlbGluZSdcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cydcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKlxuICogVGhpcyBjbGFzcyByZXByZXNlbnRzIHRoZSBsb2dpYyBhbmQgc3RhdGUgY29udGFpbm1lbnQgZm9yIGJ1aWxkaW5nXG4gKiBmb3JnZSBwcm9qZWN0c1xuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmV4cG9ydCBjbGFzcyBGb3JnZUJ1aWxkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgcHVibGljIGZvcmdlQ29uZmlnOiBGb3JnZUNvbmZpZ1xuICAgcmVhZG9ubHkgb3B0aW9uczogRm9yZ2VPcHRpb25zXG4gICBwcml2YXRlIHBpcGVsaW5lVG9TdGF0ZU1hcDogTWFwPElGb3JnZVBpcGVsaW5lLCBJQnVpbGRTdGF0ZT5cblxuICAgY29uc3RydWN0b3IoY29uZmlnOiBGb3JnZUNvbmZpZywgb3B0aW9uczogRm9yZ2VPcHRpb25zKSB7XG4gICAgICBzdXBlcigpXG4gICAgICB0aGlzLmZvcmdlQ29uZmlnID0gY29uZmlnXG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgICB0aGlzLnBpcGVsaW5lVG9TdGF0ZU1hcCA9IG5ldyBNYXA8SUZvcmdlUGlwZWxpbmUsIElCdWlsZFN0YXRlPigpXG4gICB9XG5cbiAgIHB1YmxpYyBnZXQgcGlwZWxpbmVzKCk6IEFycmF5PElGb3JnZVBpcGVsaW5lPiB7XG4gICAgICByZXR1cm4gdGhpcy5mb3JnZUNvbmZpZy5waXBlbGluZXMgfHwgW11cbiAgIH1cblxuICAgcHVibGljIGdldCBwbHVnaW5zKCk6IEFycmF5PE5hbWVkUGx1Z2luPiB7XG4gICAgICByZXR1cm4gdGhpcy5mb3JnZUNvbmZpZy5wbHVnaW5zXG4gICB9XG5cbiAgIHB1YmxpYyByZXNldCgpOiB2b2lkIHtcbiAgICAgIHRoaXMucGlwZWxpbmVUb1N0YXRlTWFwLmNsZWFyKClcbiAgIH1cblxuICAgcHVibGljIGdldCBsb2dnZXIoKTogSUxvZ2dlciB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxvZ2dlciB8fCBFbXB0eUxvZ2dlclxuICAgfVxuXG4gICAvKipcbiAgICAqIEJ1aWxkcyBhbGwgb2YgdGhlIHByb2plY3RzLiBUaGUgZW50aXJlIGJ1aWxkIHByb2Nlc3MgaXMgdHJhY2tlZFxuICAgICogdGhyb3VnaCBhIEJ1aWxkUmVjb3JkLiBUaGlzIGNvbnRhaW5zIGVhY2ggc3RhZ2UncyB2YXVsdHMsIGFzIHdlbGxcbiAgICAqIGFzIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGVhY2ggc3RhZ2Ugb2YgYSBidWlsZC5cbiAgICAqL1xuICAgcHVibGljIGFzeW5jIGJ1aWxkKCk6IFByb21pc2U8QnVpbGRSZWNvcmQ+IHtcbiAgICAgIHRoaXMucmVzZXQoKVxuXG4gICAgICBsZXQgcmVjb3JkID0gbmV3IEJ1aWxkUmVjb3JkKHRoaXMucGlwZWxpbmVzKVxuXG4gICAgICAvLyBTZXJpYWxseSBpbXBvcnRcbiAgICAgIGZvciAobGV0IHBpcGVsaW5lIG9mIHRoaXMucGlwZWxpbmVzKSB7XG4gICAgICAgICBhd2FpdCB0aGlzLmJ1aWxkUGlwZWxpbmUocGlwZWxpbmUsIHJlY29yZClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlY29yZFxuICAgfVxuXG4gICBwcml2YXRlIGFzeW5jIGJ1aWxkUGlwZWxpbmUocGlwZWxpbmU6IElGb3JnZVBpcGVsaW5lLCByZWNvcmQ6IEJ1aWxkUmVjb3JkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAvL2xldCBzdGFydCA9IGVsYXBzZWRUaW1lKClcbiAgICAgIGxldCBzdGF0ZSA9IG5ldyBCdWlsZFN0YXRlKHBpcGVsaW5lLCByZWNvcmQsIHRoaXMub3B0aW9ucylcblxuICAgICAgcmVjb3JkLnZhdWx0cy5zZXQocGlwZWxpbmUubmFtZSwgc3RhdGUudmF1bHQpXG5cbiAgICAgIGF3YWl0IHRoaXMucnVuUGlwZWxpbmVTY3JpcHQocGlwZWxpbmUsICdiZWZvcmVSdW4nLCBbc3RhdGVdKVxuXG4gICAgICBsZXQgcGxpbmUgPSBQaXBlbGluZS50b1BpcGVsaW5lKHBpcGVsaW5lLnN0ZXBzKVxuICAgICAgYXdhaXQgcGxpbmUucnVuKHN0YXRlKVxuXG4gICAgICBhd2FpdCB0aGlzLnJ1blBpcGVsaW5lU2NyaXB0KHBpcGVsaW5lLCAnYWZ0ZXJSdW4nLCBbc3RhdGVdKVxuICAgfVxuXG4gICBydW5QaXBlbGluZVNjcmlwdChwaXBlbGluZTogRm9yZ2VQaXBlbGluZSwgc2NyaXB0TmFtZTogc3RyaW5nLCBhcmdzOiBBcnJheTxhbnk+KSB7XG4gICAgICByZXR1cm4gcGlwZWxpbmUuc2NyaXB0W3NjcmlwdE5hbWVdID9cbiAgICAgICAgIHBpcGVsaW5lLnNjcmlwdFtzY3JpcHROYW1lXSguLi5hcmdzKSA6XG4gICAgICAgICBQcm9taXNlLnJlc29sdmUoKVxuICAgfVxufSJdfQ==