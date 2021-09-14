"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipeline = void 0;
const Promise_1 = require("../utils/Promise");
const events_1 = require("events");
const StreamTrait_1 = require("../traits/StreamTrait");
const PipelineNode_1 = require("./PipelineNode");
/**
 * This class represents a series of PipelineNodes that are
 * connected to each other. Each Node represnets a Step, which in
 * turn represents a stream.
 */
class Pipeline extends events_1.EventEmitter {
    constructor(stepMap) {
        super();
        this.stepMap = stepMap;
    }
    get nodes() {
        return Array.from(this.stepMap.values());
    }
    static toPipeline(steps) {
        /*
           We build up the Pipeline Tree here, connecting each of the
           dependent steps to one another.
  
           We don't start piping the data here, we just setup the local
           connections in preparation for the run.
        */
        let stepMap = new Map();
        for (let step of steps) {
            stepMap.set(step.alias, new PipelineNode_1.PipelineNode(step));
        }
        for (let node of stepMap.values()) {
            for (let use of node.step.use) {
                let ref = stepMap.get(use);
                if (ref === undefined) {
                    throw new Error(`A Step (${node.step.alias}) references a 'use' step (${use}) that does not exist`);
                }
                node.prev.push(ref);
                ref.next.push(node);
            }
        }
        // let starters = Array.from(stepMap.values()).filter(n => n.prev.length == 0)
        // for (let node of starters) {
        //    let str = `[${node.alias}]`
        //    str += ` --> [${node.next.map(n => n.alias).join(' | ')}]`
        //    for(let next of node.next) {
        //       str += ` --> [${node.next.map(n => n.alias).join(' | ')}]`
        //    }
        //    console.log(str)
        // }
        return new Pipeline(stepMap);
    }
    get(alias) {
        return this.stepMap.get(alias);
    }
    async run(state) {
        var _a, _b, _c, _d;
        /*
           For running streams we:
              1) Create all streams in each PipelineNode
              2) Connect the streams
              3) Monitor the streams until they finish/error
        */
        let nodes = this.nodes;
        for (let node of nodes) {
            await node.makeStream(state);
        }
        await this.preProcessNodes(nodes);
        let def = Promise_1.defer();
        let nodeCount = this.stepMap.size;
        let closeCount = 0;
        let onClose = () => {
            closeCount++;
            if (closeCount >= nodeCount) {
                def.resolve();
            }
        };
        let onError = (err) => {
            var _a;
            for (let node of nodes) {
                (_a = node.stream) === null || _a === void 0 ? void 0 : _a.destroy();
            }
            def.reject(err);
        };
        let self = this;
        for (let node of nodes) {
            if (node.stream == null) {
                continue;
            }
            //@ts-ignore
            if (node.stream.writable) {
                (_a = node.stream) === null || _a === void 0 ? void 0 : _a.on('finish', onClose);
                //@ts-ignore
            }
            else if (node.stream.readable) {
                (_b = node.stream) === null || _b === void 0 ? void 0 : _b.on('end', onClose);
            }
            else {
                console.log('huh?');
            }
            (_c = node.stream) === null || _c === void 0 ? void 0 : _c.on('error', onError);
            (_d = node.stream) === null || _d === void 0 ? void 0 : _d.on('rate', data => {
                self.emit('rate', {
                    alias: node.alias,
                    progress: data.progress,
                    label: data.label
                });
            });
        }
        for (let node of nodes) {
            await node.connect(state);
        }
        return def.promise;
    }
    async preProcessNodes(nodes) {
        /*
           For Pre Processing the Nodes, we iterate through all of
           the streams and:
              1) Collect all Stream Traits
              2) Apply the Traits
        */
        let streams = nodes.map(node => node.stream);
        let traits = new Array();
        for (let stream of streams) {
            if (!StreamTrait_1.StreamTraitContainer.hasTraits(stream)) {
                continue;
            }
            // @ts-ignore
            let cast = stream;
            await cast.setTraits(traits);
        }
        for (let trait of traits) {
            await trait.apply(this);
        }
    }
}
exports.Pipeline = Pipeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGlwZWxpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29yZS9QaXBlbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSw4Q0FBd0M7QUFDeEMsbUNBQXFDO0FBQ3JDLHVEQUFpRztBQUNqRyxpREFBNEQ7QUFRNUQ7Ozs7R0FJRztBQUNILE1BQWEsUUFBUyxTQUFRLHFCQUFZO0lBT3ZDLFlBQW9CLE9BQWtDO1FBQ25ELEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7SUFDekIsQ0FBQztJQVBELElBQUksS0FBSztRQUNOLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQU9ELE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBYztRQUM3Qjs7Ozs7O1VBTUU7UUFFRixJQUFJLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBd0IsQ0FBQTtRQUU3QyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtZQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSwyQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7U0FDakQ7UUFFRCxLQUFLLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNoQyxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUM1QixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUUxQixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7b0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssOEJBQThCLEdBQUcsdUJBQXVCLENBQUMsQ0FBQTtpQkFDckc7Z0JBRUQsSUFBSSxD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QUMzQjtRQUVELE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQTtJQUNyQixDQUFDO0lBRU8sS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFxQjtRQUNoRDs7Ozs7VUFLRTtRQUVGLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDNUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQWdCLENBQUE7UUFFdEMsS0FBSSxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDeEIsSUFBRyxDQUFDLGtDQUFvQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDekMsU0FBUTthQUNWO1lBRUQsYUFBYTtZQUNiLElBQUksSUFBSSxHQUFHLE1BQStCLENBQUE7WUFDMUMsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQzlCO1FBRUQsS0FBSSxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7WUFDdEIsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ3pCO0lBQ0osQ0FBQztDQUNIO0FBeEpELDRCQXdKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElTdGVwIH0gZnJvbSAnLi9TdGVwJ1xuaW1wb3J0IHsgSUJ1aWxkU3RhdGUgfSBmcm9tICcuL0J1aWxkU3RhdGUnXG5pbXBvcnQgeyBkZWZlciB9IGZyb20gJy4uL3V0aWxzL1Byb21pc2UnXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnXG5pbXBvcnQgeyBJU3RyZWFtVHJhaXQsIElTdHJlYW1UcmFpdENvbnRhaW5lciwgU3RyZWFtVHJhaXRDb250YWluZXIgfSBmcm9tICcuLi90cmFpdHMvU3RyZWFtVHJhaXQnXG5pbXBvcnQgeyBJUGlwZWxpbmVOb2RlLCBQaXBlbGluZU5vZGUgfSBmcm9tICcuL1BpcGVsaW5lTm9kZSdcblxuXG5leHBvcnQgaW50ZXJmYWNlIElQaXBlbGluZSB7XG4gICByZWFkb25seSBub2RlczogSVBpcGVsaW5lTm9kZVtdXG4gICBnZXQoYWxpYXM6IHN0cmluZyk6IElQaXBlbGluZU5vZGUgfCB1bmRlZmluZWRcbn1cblxuLyoqXG4gKiBUaGlzIGNsYXNzIHJlcHJlc2VudHMgYSBzZXJpZXMgb2YgUGlwZWxpbmVOb2RlcyB0aGF0IGFyZVxuICogY29ubmVjdGVkIHRvIGVhY2ggb3RoZXIuIEVhY2ggTm9kZSByZXByZXNuZXRzIGEgU3RlcCwgd2hpY2ggaW5cbiAqIHR1cm4gcmVwcmVzZW50cyBhIHN0cmVhbS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBpcGVsaW5lIGV4dGVuZHMgRXZlbnRFbWl0dGVyIGltcGxlbWVudHMgSVBpcGVsaW5lIHtcbiAgIHJlYWRvbmx5IHN0ZXBNYXA6IE1hcDxzdHJpbmcsIFBpcGVsaW5lTm9kZT5cblxuICAgZ2V0IG5vZGVzKCk6IElQaXBlbGluZU5vZGVbXSB7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnN0ZXBNYXAudmFsdWVzKCkpXG4gICB9XG5cbiAgIHByaXZhdGUgY29uc3RydWN0b3Ioc3RlcE1hcDogTWFwPHN0cmluZywgUGlwZWxpbmVOb2RlPikge1xuICAgICAgc3VwZXIoKVxuICAgICAgdGhpcy5zdGVwTWFwID0gc3RlcE1hcFxuICAgfVxuXG4gICBzdGF0aWMgdG9QaXBlbGluZShzdGVwczogSVN0ZXBbXSk6IFBpcGVsaW5lIHtcbiAgICAgIC8qXG4gICAgICAgICBXZSBidWlsZCB1cCB0aGUgUGlwZWxpbmUgVHJlZSBoZXJlLCBjb25uZWN0aW5nIGVhY2ggb2YgdGhlXG4gICAgICAgICBkZXBlbmRlbnQgc3RlcHMgdG8gb25lIGFub3RoZXIuXG5cbiAgICAgICAgIFdlIGRvbid0IHN0YXJ0IHBpcGluZyB0aGUgZGF0YSBoZXJlLCB3ZSBqdXN0IHNldHVwIHRoZSBsb2NhbFxuICAgICAgICAgY29ubmVjdGlvbnMgaW4gcHJlcGFyYXRpb24gZm9yIHRoZSBydW4uXG4gICAgICAqL1xuXG4gICAgICBsZXQgc3RlcE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBQaXBlbGluZU5vZGU+KClcblxuICAgICAgZm9yIChsZXQgc3RlcCBvZiBzdGVwcykge1xuICAgICAgICAgc3RlcE1hcC5zZXQoc3RlcC5hbGlhcywgbmV3IFBpcGVsaW5lTm9kZShzdGVwKSlcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgbm9kZSBvZiBzdGVwTWFwLnZhbHVlcygpKSB7XG4gICAgICAgICBmb3IgKGxldCB1c2Ugb2Ygbm9kZS5zdGVwLnVzZSkge1xuICAgICAgICAgICAgbGV0IHJlZiA9IHN0ZXBNYXAuZ2V0KHVzZSlcblxuICAgICAgICAgICAgaWYgKHJlZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEEgU3RlcCAoJHtub2RlLnN0ZXAuYWxpYXN9KSByZWZlcmVuY2VzIGEgJ3VzZScgc3RlcCAoJHt1c2V9KSB0aGF0IGRvZXMgbm90IGV4aXN0YClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbm9kZS5wcmV2LnB1c2gocmVmKVxuICAgICAgICAgICAgcmVmLm5leHQucHVzaChub2RlKVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBsZXQgc3RhcnRlcnMgPSBBcnJheS5mcm9tKHN0ZXBNYXAudmFsdWVzKCkpLmZpbHRlcihuID0+IG4ucHJldi5sZW5ndGggPT0gMClcbiAgICAgIC8vIGZvciAobGV0IG5vZGUgb2Ygc3RhcnRlcnMpIHtcbiAgICAgIC8vICAgIGxldCBzdHIgPSBgWyR7bm9kZS5hbGlhc31dYFxuICAgICAgLy8gICAgc3RyICs9IGAgLS0+IFske25vZGUubmV4dC5tYXAobiA9PiBuLmFsaWFzKS5qb2luKCcgfCAnKX1dYFxuXG4gICAgICAvLyAgICBmb3IobGV0IG5leHQgb2Ygbm9kZS5uZXh0KSB7XG4gICAgICAvLyAgICAgICBzdHIgKz0gYCAtLT4gWyR7bm9kZS5uZXh0Lm1hcChuID0+IG4uYWxpYXMpLmpvaW4oJyB8ICcpfV1gXG4gICAgICAvLyAgICB9XG4gICAgICAvLyAgICBjb25zb2xlLmxvZyhzdHIpXG4gICAgICAvLyB9XG5cbiAgICAgIHJldHVybiBuZXcgUGlwZWxpbmUoc3RlcE1hcClcbiAgIH1cblxuICAgZ2V0KGFsaWFzOiBzdHJpbmcpOiBJUGlwZWxpbmVOb2RlIHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiB0aGlzLnN0ZXBNYXAuZ2V0KGFsaWFzKVxuICAgfVxuXG4gICBhc3luYyBydW4oc3RhdGU6IElCdWlsZFN0YXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAvKlxuICAgICAgICAgRm9yIHJ1bm5pbmcgc3RyZWFtcyB3ZTpcbiAgICAgICAgICAgIDEpIENyZWF0ZSBhbGwgc3RyZWFtcyBpbiBlYWNoIFBpcGVsaW5lTm9kZVxuICAgICAgICAgICAgMikgQ29ubmVjdCB0aGUgc3RyZWFtc1xuICAgICAgICAgICAgMykgTW9uaXRvciB0aGUgc3RyZWFtcyB1bnRpbCB0aGV5IGZpbmlzaC9lcnJvclxuICAgICAgKi9cbiAgICAgIGxldCBub2RlcyA9IHRoaXMubm9kZXMgYXMgUGlwZWxpbmVOb2RlW11cblxuICAgICAgZm9yIChsZXQgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgYXdhaXQgbm9kZS5tYWtlU3RyZWFtKHN0YXRlKVxuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLnByZVByb2Nlc3NOb2Rlcyhub2RlcylcblxuICAgICAgbGV0IGRlZiA9IGRlZmVyPHZvaWQ+KClcblxuICAgICAgbGV0IG5vZGVDb3VudCA9IHRoaXMuc3RlcE1hcC5zaXplXG4gICAgICBsZXQgY2xvc2VDb3VudCA9IDBcblxuICAgICAgbGV0IG9uQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAgICBjbG9zZUNvdW50KytcblxuICAgICAgICAgaWYoY2xvc2VDb3VudCA+PSBub2RlQ291bnQpIHtcbiAgICAgICAgICAgIGRlZi5yZXNvbHZlKClcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IG9uRXJyb3IgPSAoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgZm9yIChsZXQgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgbm9kZS5zdHJlYW0/LmRlc3Ryb3koKVxuICAgICAgICAgfVxuXG4gICAgICAgICBkZWYucmVqZWN0KGVycilcbiAgICAgIH1cblxuICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICBmb3IgKGxldCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICAgICBpZihub2RlLnN0cmVhbSA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgfVxuXG4gICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgIGlmKG5vZGUuc3RyZWFtLndyaXRhYmxlKSB7XG4gICAgICAgICAgICBub2RlLnN0cmVhbT8ub24oJ2ZpbmlzaCcsIG9uQ2xvc2UpXG4gICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgIH0gZWxzZSBpZihub2RlLnN0cmVhbS5yZWFkYWJsZSkge1xuICAgICAgICAgICAgbm9kZS5zdHJlYW0/Lm9uKCdlbmQnLCBvbkNsb3NlKVxuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdodWg/JylcbiAgICAgICAgIH1cblxuICAgICAgICAgbm9kZS5zdHJlYW0/Lm9uKCdlcnJvcicsIG9uRXJyb3IpXG4gICAgICAgICBub2RlLnN0cmVhbT8ub24oJ3JhdGUnLCBkYXRhID0+IHtcbiAgICAgICAgICAgIHNlbGYuZW1pdCgncmF0ZScsIHtcbiAgICAgICAgICAgICAgIGFsaWFzOiBub2RlLmFsaWFzLFxuICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IGRhdGEucHJvZ3Jlc3MsXG4gICAgICAgICAgICAgICBsYWJlbDogZGF0YS5sYWJlbFxuICAgICAgICAgICAgfSlcbiAgICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgIGF3YWl0IG5vZGUuY29ubmVjdChzdGF0ZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlZi5wcm9taXNlXG4gICB9XG5cbiAgIHByaXZhdGUgYXN5bmMgcHJlUHJvY2Vzc05vZGVzKG5vZGVzOiBQaXBlbGluZU5vZGVbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgLypcbiAgICAgICAgIEZvciBQcmUgUHJvY2Vzc2luZyB0aGUgTm9kZXMsIHdlIGl0ZXJhdGUgdGhyb3VnaCBhbGwgb2ZcbiAgICAgICAgIHRoZSBzdHJlYW1zIGFuZDpcbiAgICAgICAgICAgIDEpIENvbGxlY3QgYWxsIFN0cmVhbSBUcmFpdHNcbiAgICAgICAgICAgIDIpIEFwcGx5IHRoZSBUcmFpdHNcbiAgICAgICovXG5cbiAgICAgIGxldCBzdHJlYW1zID0gbm9kZXMubWFwKG5vZGUgPT4gbm9kZS5zdHJlYW0pXG4gICAgICBsZXQgdHJhaXRzID0gbmV3IEFycmF5PElTdHJlYW1UcmFpdD4oKVxuXG4gICAgICBmb3IobGV0IHN0cmVhbSBvZiBzdHJlYW1zKSB7XG4gICAgICAgICBpZighU3RyZWFtVHJhaXRDb250YWluZXIuaGFzVHJhaXRzKHN0cmVhbSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlICBcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgbGV0IGNhc3QgPSBzdHJlYW0gYXMgSVN0cmVhbVRyYWl0Q29udGFpbmVyXG4gICAgICAgICBhd2FpdCBjYXN0LnNldFRyYWl0cyh0cmFpdHMpXG4gICAgICB9XG5cbiAgICAgIGZvcihsZXQgdHJhaXQgb2YgdHJhaXRzKSB7XG4gICAgICAgICBhd2FpdCB0cmFpdC5hcHBseSh0aGlzKVxuICAgICAgfVxuICAgfVxufVxuIl19