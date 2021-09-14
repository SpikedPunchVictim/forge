"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineNode = void 0;
const NoOpStream_1 = require("../streams/NoOpStream");
const WriteToManyStream_1 = require("../streams/WriteToManyStream");
/**
 * This class represents a single Node in a Pipeline. Each Node
 * is connected to other Nodes upstream (prev) and downstream (next).
 */
class PipelineNode {
    constructor(step) {
        this.prev = new Array();
        this.next = new Array();
        this._stream = undefined;
        this.step = step;
        this.connected = new Array();
    }
    get stream() {
        return this._stream;
    }
    get alias() {
        return this.step.alias;
    }
    async connect(state) {
        if (this.stream === undefined) {
            await this.makeStream(state);
        }
        for (let prev of this.prev) {
            prev.pipe(this);
        }
        this.pipe(this.next);
    }
    pipe(nodes) {
        var _a;
        let pipeNode = (node) => {
            if (this.connected.includes(node.step.alias)) {
                return;
            }
            if (node.stream === undefined) {
                throw new Error(`Cannot connect PipelineNodes that have no streams`);
            }
            //console.log(`piping [${this.alias}] --> [${node.alias}]`)
            //@ts-ignore
            this.stream.pipe(node.stream);
            //this.stream?.on('data', data => console.log(`${this.alias} ${data}`))
            this.connected.push(node.step.alias);
        };
        if (!Array.isArray(nodes)) {
            pipeNode(nodes);
            return;
        }
        if (nodes.length == 0) {
            return;
        }
        if (nodes.length == 1) {
            pipeNode(nodes[0]);
        }
        else if (nodes.length > 1) {
            // If we're writing to multiple streams, we wrap them in a WriteToManyStream to
            // manage backpressure from all of them.
            let writeToMany = new WriteToManyStream_1.WriteToManyStream(nodes.map(it => it.stream));
            (_a = this.stream) === null || _a === void 0 ? void 0 : _a.pipe(writeToMany);
            this.connected.push(...nodes.map(it => it.alias));
        }
    }
    /**
     * Based on the position in the Pipeline, will setup
     * this node's stream.
     */
    async makeStream(state) {
        if (this.stream !== undefined) {
            return this.stream;
        }
        let hasSource = this.prev.length > 0;
        let hasDest = this.next.length > 0;
        if (!hasSource && !hasDest) {
            this._stream = new NoOpStream_1.NoOpReadStream();
            return this._stream;
        }
        if (!hasSource && hasDest) {
            this._stream = await this.step.plugin.read(state, this.step);
        }
        if (hasSource && !hasDest) {
            this._stream = await this.step.plugin.write(state, this.step);
        }
        if (hasSource && hasDest) {
            this._stream = await this.step.plugin.transform(state, this.step);
        }
        if (this.stream === undefined) {
            throw new Error(`Could not create stream from the step ${this.step.alias}`);
        }
        return this.stream;
    }
}
exports.PipelineNode = PipelineNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGlwZWxpbmVOb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvUGlwZWxpbmVOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHNEQUFzRDtBQUN0RCxvRUFBZ0U7QUFhaEU7OztHQUdHO0FBQ0gsTUFBYSxZQUFZO0lBZ0J0QixZQUFZLElBQVc7UUFmZCxTQUFJLEdBQW1CLElBQUksS0FBSyxFQUFnQixDQUFBO1FBRWhELFNBQUksR0FBbUIsSUFBSSxLQUFLLEVBQWdCLENBQUE7UUFXakQsWUFBTyxHQUFnRCxTQUFTLENBQUE7UUFHckUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFBO0lBQ3ZDLENBQUM7SUFkRCxJQUFJLE1BQU07UUFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDdEIsQ0FBQztJQUVELElBQUksS0FBSztRQUNOLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUE7SUFDekIsQ0FBQztJQVVELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBa0I7UUFDN0IsSUFBRyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUMzQixNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDOUI7UUFFRCxLQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNqQjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBb0M7O1FBQ3RDLElBQUksUUFBUSxHQUFHLENBQUMsSUFBa0IsRUFBRSxFQUFFO1lBQ25DLElBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxD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QUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7U0FDN0U7UUFFRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDckIsQ0FBQztDQUNIO0FBM0dELG9DQTJHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlYWRhYmxlLCBXcml0YWJsZSwgVHJhbnNmb3JtIH0gZnJvbSAncmVhZGFibGUtc3RyZWFtJ1xuaW1wb3J0IHsgTm9PcFJlYWRTdHJlYW0gfSBmcm9tICcuLi9zdHJlYW1zL05vT3BTdHJlYW0nXG5pbXBvcnQgeyBXcml0ZVRvTWFueVN0cmVhbSB9IGZyb20gJy4uL3N0cmVhbXMvV3JpdGVUb01hbnlTdHJlYW0nXG5pbXBvcnQgeyBJQnVpbGRTdGF0ZSB9IGZyb20gJy4vQnVpbGRTdGF0ZSdcbmltcG9ydCB7IElTdGVwIH0gZnJvbSAnLi9TdGVwJ1xuXG5leHBvcnQgaW50ZXJmYWNlIElQaXBlbGluZU5vZGUge1xuICAgcmVhZG9ubHkgcHJldjogSVBpcGVsaW5lTm9kZVtdXG4gICByZWFkb25seSBzdGVwOiBJU3RlcFxuICAgcmVhZG9ubHkgbmV4dDogSVBpcGVsaW5lTm9kZVtdXG5cbiAgIHJlYWRvbmx5IGFsaWFzOiBzdHJpbmdcbiAgIHJlYWRvbmx5IHN0cmVhbTogUmVhZGFibGUgfCBXcml0YWJsZSB8IFRyYW5zZm9ybSB8IHVuZGVmaW5lZFxufVxuXG4vKipcbiAqIFRoaXMgY2xhc3MgcmVwcmVzZW50cyBhIHNpbmdsZSBOb2RlIGluIGEgUGlwZWxpbmUuIEVhY2ggTm9kZVxuICogaXMgY29ubmVjdGVkIHRvIG90aGVyIE5vZGVzIHVwc3RyZWFtIChwcmV2KSBhbmQgZG93bnN0cmVhbSAobmV4dCkuXG4gKi9cbmV4cG9ydCBjbGFzcyBQaXBlbGluZU5vZGUgaW1wbGVtZW50cyBJUGlwZWxpbmVOb2RlIHtcbiAgIHJlYWRvbmx5IHByZXY6IFBpcGVsaW5lTm9kZVtdID0gbmV3IEFycmF5PFBpcGVsaW5lTm9kZT4oKVxuICAgcmVhZG9ubHkgc3RlcDogSVN0ZXBcbiAgIHJlYWRvbmx5IG5leHQ6IFBpcGVsaW5lTm9kZVtdID0gbmV3IEFycmF5PFBpcGVsaW5lTm9kZT4oKVxuXG4gICBnZXQgc3RyZWFtKCk6IFJlYWRhYmxlIHwgV3JpdGFibGUgfCBUcmFuc2Zvcm0gfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0cmVhbVxuICAgfVxuXG4gICBnZXQgYWxpYXMoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLnN0ZXAuYWxpYXNcbiAgIH1cblxuICAgcHJpdmF0ZSBjb25uZWN0ZWQ6IEFycmF5PHN0cmluZz5cbiAgIHByaXZhdGUgX3N0cmVhbTogUmVhZGFibGUgfCBXcml0YWJsZSB8IFRyYW5zZm9ybSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gICBjb25zdHJ1Y3RvcihzdGVwOiBJU3RlcCkge1xuICAgICAgdGhpcy5zdGVwID0gc3RlcFxuICAgICAgdGhpcy5jb25uZWN0ZWQgPSBuZXcgQXJyYXk8c3RyaW5nPigpXG4gICB9XG5cbiAgIGFzeW5jIGNvbm5lY3Qoc3RhdGU6IElCdWlsZFN0YXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBpZih0aGlzLnN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICBhd2FpdCB0aGlzLm1ha2VTdHJlYW0oc3RhdGUpXG4gICAgICB9XG5cbiAgICAgIGZvcihsZXQgcHJldiBvZiB0aGlzLnByZXYpIHtcbiAgICAgICAgIHByZXYucGlwZSh0aGlzKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnBpcGUodGhpcy5uZXh0KVxuICAgfVxuXG4gICBwaXBlKG5vZGVzOiBQaXBlbGluZU5vZGUgfCBQaXBlbGluZU5vZGVbXSk6IHZvaWQge1xuICAgICAgbGV0IHBpcGVOb2RlID0gKG5vZGU6IFBpcGVsaW5lTm9kZSkgPT4ge1xuICAgICAgICAgaWYodGhpcy5jb25uZWN0ZWQuaW5jbHVkZXMobm9kZS5zdGVwLmFsaWFzKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICB9XG4gICBcbiAgICAgICAgIGlmKG5vZGUuc3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNvbm5lY3QgUGlwZWxpbmVOb2RlcyB0aGF0IGhhdmUgbm8gc3RyZWFtc2ApXG4gICAgICAgICB9XG4gICBcbiAgICAgICAgIC8vY29uc29sZS5sb2coYHBpcGluZyBbJHt0aGlzLmFsaWFzfV0gLS0+IFske25vZGUuYWxpYXN9XWApXG4gICBcbiAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgdGhpcy5zdHJlYW0ucGlwZShub2RlLnN0cmVhbSlcbiAgICAgICAgIC8vdGhpcy5zdHJlYW0/Lm9uKCdkYXRhJywgZGF0YSA9PiBjb25zb2xlLmxvZyhgJHt0aGlzLmFsaWFzfSAke2RhdGF9YCkpXG4gICBcbiAgICAgICAgIHRoaXMuY29ubmVjdGVkLnB1c2gobm9kZS5zdGVwLmFsaWFzKVxuICAgICAgfVxuXG4gICAgICBpZighQXJyYXkuaXNBcnJheShub2RlcykpIHtcbiAgICAgICAgIHBpcGVOb2RlKG5vZGVzKVxuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYobm9kZXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgIHBpcGVOb2RlKG5vZGVzWzBdKVxuICAgICAgfSBlbHNlIGlmIChub2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAvLyBJZiB3ZSdyZSB3cml0aW5nIHRvIG11bHRpcGxlIHN0cmVhbXMsIHdlIHdyYXAgdGhlbSBpbiBhIFdyaXRlVG9NYW55U3RyZWFtIHRvXG4gICAgICAgICAvLyBtYW5hZ2UgYmFja3ByZXNzdXJlIGZyb20gYWxsIG9mIHRoZW0uXG4gICAgICAgICBsZXQgd3JpdGVUb01hbnkgPSBuZXcgV3JpdGVUb01hbnlTdHJlYW0obm9kZXMubWFwKGl0ID0+IGl0LnN0cmVhbSBhcyBXcml0YWJsZSkpXG4gICAgICAgICB0aGlzLnN0cmVhbT8ucGlwZSh3cml0ZVRvTWFueSlcbiAgICAgICAgIHRoaXMuY29ubmVjdGVkLnB1c2goLi4ubm9kZXMubWFwKGl0ID0+IGl0LmFsaWFzKSlcbiAgICAgIH1cbiAgIH1cblxuICAgLyoqXG4gICAgKiBCYXNlZCBvbiB0aGUgcG9zaXRpb24gaW4gdGhlIFBpcGVsaW5lLCB3aWxsIHNldHVwXG4gICAgKiB0aGlzIG5vZGUncyBzdHJlYW0uXG4gICAgKi9cbiAgIGFzeW5jIG1ha2VTdHJlYW0oc3RhdGU6IElCdWlsZFN0YXRlKTogUHJvbWlzZTxSZWFkYWJsZSB8IFdyaXRhYmxlIHwgVHJhbnNmb3JtPiB7XG4gICAgICBpZih0aGlzLnN0cmVhbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICByZXR1cm4gdGhpcy5zdHJlYW1cbiAgICAgIH1cblxuICAgICAgbGV0IGhhc1NvdXJjZSA9IHRoaXMucHJldi5sZW5ndGggPiAwXG4gICAgICBsZXQgaGFzRGVzdCA9IHRoaXMubmV4dC5sZW5ndGggPiAwXG5cbiAgICAgIGlmKCFoYXNTb3VyY2UgJiYgIWhhc0Rlc3QpIHtcbiAgICAgICAgIHRoaXMuX3N0cmVhbSA9IG5ldyBOb09wUmVhZFN0cmVhbSgpXG4gICAgICAgICByZXR1cm4gdGhpcy5fc3RyZWFtXG4gICAgICB9XG5cbiAgICAgIGlmICghaGFzU291cmNlICYmIGhhc0Rlc3QpIHtcbiAgICAgICAgIHRoaXMuX3N0cmVhbSA9IGF3YWl0IHRoaXMuc3RlcC5wbHVnaW4ucmVhZChzdGF0ZSwgdGhpcy5zdGVwKVxuICAgICAgfSBcblxuICAgICAgaWYoaGFzU291cmNlICYmICFoYXNEZXN0KSB7XG4gICAgICAgICB0aGlzLl9zdHJlYW0gPSBhd2FpdCB0aGlzLnN0ZXAucGx1Z2luLndyaXRlKHN0YXRlLCB0aGlzLnN0ZXApXG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmKGhhc1NvdXJjZSAmJiBoYXNEZXN0KSB7XG4gICAgICAgICB0aGlzLl9zdHJlYW0gPSBhd2FpdCB0aGlzLnN0ZXAucGx1Z2luLnRyYW5zZm9ybShzdGF0ZSwgdGhpcy5zdGVwKSBcbiAgICAgIH1cbiAgICBcbiAgICAgIGlmKHRoaXMuc3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGNyZWF0ZSBzdHJlYW0gZnJvbSB0aGUgc3RlcCAke3RoaXMuc3RlcC5hbGlhc31gKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zdHJlYW1cbiAgIH1cbn1cbiJdfQ==