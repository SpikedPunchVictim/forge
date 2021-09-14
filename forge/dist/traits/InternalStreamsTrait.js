"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalStreamsTrait = void 0;
const StreamTrait_1 = require("./StreamTrait");
/**
 * This Stream Trait stores references a set of streams based on their alias
 */
class InternalStreamsTrait {
    constructor(streamNames) {
        this.type = StreamTrait_1.Trait.InternalStrams;
        this._streams = new Map();
        for (let name of streamNames) {
            this._streams.set(name, undefined);
        }
    }
    get streams() {
        return Array.from(this._streams.keys());
    }
    async apply(pipeline) {
        for (let name of this.streams) {
            let node = pipeline.get(name);
            if (node === undefined) {
                throw new Error(`InternalStreamsTrait encountered a stream alias that does not exist in the forge file. Ensure that all the stream aliases are spelled correctly and that they exist.`);
            }
            if (node.stream === undefined) {
                throw new Error(`A StreamTrait is being applied before the streams are created. Streams must be created before Traits can be applied.`);
            }
            this._streams.set(name, node.stream);
        }
    }
    get(name) {
        return this._streams.get(name);
    }
    pair(name, stream) {
        this._streams.set(name, stream);
    }
}
exports.InternalStreamsTrait = InternalStreamsTrait;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJuYWxTdHJlYW1zVHJhaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhaXRzL0ludGVybmFsU3RyZWFtc1RyYWl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLCtDQUFvRDtBQUVwRDs7R0FFRztBQUNILE1BQWEsb0JBQW9CO0lBUzlCLFlBQVksV0FBcUI7UUFSeEIsU0FBSSxHQUFXLG1CQUFLLENBQUMsY0FBYyxDQUFBO1FBU3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQXFFLENBQUE7UUFFNUYsS0FBSSxJQUFJLElBQUksSUFBSSxXQUFXLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1NBQ3BDO0lBQ0osQ0FBQztJQVpELElBQUksT0FBTztRQUNSLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7SUFDMUMsQ0FBQztJQVlELEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBbUI7UUFDNUIsS0FBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzNCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFN0IsSUFBRyxJQUFJLEtBQUssU0FBUyxFQUFFO2dCQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLHNLQUFzSyxDQUFDLENBQUE7YUFDekw7WUFFRCxJQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLHNIQUFzSCxDQUFDLENBQUE7YUFDekk7WUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQ3RDO0lBQ0osQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFZO1FBQ2IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNqQyxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQVksRUFBRSxNQUFxRDtRQUNyRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDbEMsQ0FBQztDQUNIO0FBeENELG9EQXdDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRyYW5zZm9ybSwgV3JpdGFibGUsIFJlYWRhYmxlLCBQYXNzVGhyb3VnaCB9IGZyb20gJ3JlYWRhYmxlLXN0cmVhbSdcbmltcG9ydCB7IElQaXBlbGluZSB9IGZyb20gJy4uL2NvcmUvUGlwZWxpbmUnO1xuaW1wb3J0IHsgSVN0cmVhbVRyYWl0LCBUcmFpdCB9IGZyb20gXCIuL1N0cmVhbVRyYWl0XCI7XG5cbi8qKlxuICogVGhpcyBTdHJlYW0gVHJhaXQgc3RvcmVzIHJlZmVyZW5jZXMgYSBzZXQgb2Ygc3RyZWFtcyBiYXNlZCBvbiB0aGVpciBhbGlhc1xuICovXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxTdHJlYW1zVHJhaXQgaW1wbGVtZW50cyBJU3RyZWFtVHJhaXQge1xuICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nID0gVHJhaXQuSW50ZXJuYWxTdHJhbXNcblxuICAgZ2V0IHN0cmVhbXMoKTogc3RyaW5nW10ge1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fc3RyZWFtcy5rZXlzKCkpXG4gICB9XG5cbiAgIHByb3RlY3RlZCBfc3RyZWFtczogTWFwPHN0cmluZywgUmVhZGFibGUgfCBXcml0YWJsZSB8IFRyYW5zZm9ybSB8IFBhc3NUaHJvdWdoIHwgdW5kZWZpbmVkPlxuXG4gICBjb25zdHJ1Y3RvcihzdHJlYW1OYW1lczogc3RyaW5nW10pIHtcbiAgICAgIHRoaXMuX3N0cmVhbXMgPSBuZXcgTWFwPHN0cmluZywgUmVhZGFibGUgfCBXcml0YWJsZSB8IFRyYW5zZm9ybSB8IFBhc3NUaHJvdWdoIHwgdW5kZWZpbmVkPigpXG5cbiAgICAgIGZvcihsZXQgbmFtZSBvZiBzdHJlYW1OYW1lcykge1xuICAgICAgICAgdGhpcy5fc3RyZWFtcy5zZXQobmFtZSwgdW5kZWZpbmVkKVxuICAgICAgfVxuICAgfVxuXG4gICBhc3luYyBhcHBseShwaXBlbGluZTogSVBpcGVsaW5lKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBmb3IobGV0IG5hbWUgb2YgdGhpcy5zdHJlYW1zKSB7XG4gICAgICAgICBsZXQgbm9kZSA9IHBpcGVsaW5lLmdldChuYW1lKVxuXG4gICAgICAgICBpZihub2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW50ZXJuYWxTdHJlYW1zVHJhaXQgZW5jb3VudGVyZWQgYSBzdHJlYW0gYWxpYXMgdGhhdCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgZm9yZ2UgZmlsZS4gRW5zdXJlIHRoYXQgYWxsIHRoZSBzdHJlYW0gYWxpYXNlcyBhcmUgc3BlbGxlZCBjb3JyZWN0bHkgYW5kIHRoYXQgdGhleSBleGlzdC5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBpZihub2RlLnN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEEgU3RyZWFtVHJhaXQgaXMgYmVpbmcgYXBwbGllZCBiZWZvcmUgdGhlIHN0cmVhbXMgYXJlIGNyZWF0ZWQuIFN0cmVhbXMgbXVzdCBiZSBjcmVhdGVkIGJlZm9yZSBUcmFpdHMgY2FuIGJlIGFwcGxpZWQuYClcbiAgICAgICAgIH1cblxuICAgICAgICAgdGhpcy5fc3RyZWFtcy5zZXQobmFtZSwgbm9kZS5zdHJlYW0pXG4gICAgICB9XG4gICB9XG5cbiAgIGdldChuYW1lOiBzdHJpbmcpOiBSZWFkYWJsZSB8IFdyaXRhYmxlIHwgVHJhbnNmb3JtIHwgUGFzc1Rocm91Z2ggfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0cmVhbXMuZ2V0KG5hbWUpXG4gICB9XG5cbiAgIHBhaXIobmFtZTogc3RyaW5nLCBzdHJlYW06IFJlYWRhYmxlIHwgV3JpdGFibGUgfCBUcmFuc2Zvcm0gfCBQYXNzVGhyb3VnaCk6IHZvaWQge1xuICAgICAgdGhpcy5fc3RyZWFtcy5zZXQobmFtZSwgc3RyZWFtKVxuICAgfVxufSJdfQ==