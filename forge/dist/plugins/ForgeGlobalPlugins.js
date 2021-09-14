"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalPlugins = void 0;
class ForgeGlobalPlugins {
    constructor() {
        // Key: Plugin name
        // Value: The plugin
        this.registeredPlugins = new Map();
    }
    get plugins() {
        let results = new Array();
        for (let [key, value] of this.registeredPlugins) {
            results.push({
                name: key, plugin: value
            });
        }
        return results;
    }
    get(name) {
        return this.registeredPlugins.get(name);
    }
    register(name, plugin) {
        this.registeredPlugins.set(name, plugin);
    }
}
exports.GlobalPlugins = new ForgeGlobalPlugins();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yZ2VHbG9iYWxQbHVnaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BsdWdpbnMvRm9yZ2VHbG9iYWxQbHVnaW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLE1BQU0sa0JBQWtCO0lBQXhCO1FBQ0csbUJBQW1CO1FBQ25CLG9CQUFvQjtRQUNaLHNCQUFpQixHQUF5QixJQUFJLEdBQUcsRUFBbUIsQ0FBQTtJQXFCL0UsQ0FBQztJQW5CRSxJQUFJLE9BQU87UUFDUixJQUFJLE9BQU8sR0FBRyxJQUFJLEtBQUssRUFBZSxDQUFBO1FBRXRDLEtBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDN0MsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDVixJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLO2FBQzFCLENBQUMsQ0FBQTtTQUNKO1FBRUQsT0FBTyxPQUFPLENBQUE7SUFDakIsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFZO1FBQ2IsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzFDLENBQUM7SUFFRCxRQUFRLENBQUMsSUFBWSxFQUFFLE1BQWU7UUFDbkMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDM0MsQ0FBQztDQUNIO0FBRVUsUUFBQSxhQUFhLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmFtZWRQbHVnaW4gfSBmcm9tIFwiLi4vY29yZS9OYW1lZFBsdWdpblwiO1xuaW1wb3J0IHsgSVBsdWdpbiB9IGZyb20gXCIuL0lQbHVnaW5cIjtcblxuY2xhc3MgRm9yZ2VHbG9iYWxQbHVnaW5zIHtcbiAgIC8vIEtleTogUGx1Z2luIG5hbWVcbiAgIC8vIFZhbHVlOiBUaGUgcGx1Z2luXG4gICBwcml2YXRlIHJlZ2lzdGVyZWRQbHVnaW5zOiBNYXA8c3RyaW5nLCBJUGx1Z2luPiA9IG5ldyBNYXA8c3RyaW5nLCBJUGx1Z2luPigpXG5cbiAgIGdldCBwbHVnaW5zKCk6IE5hbWVkUGx1Z2luW10ge1xuICAgICAgbGV0IHJlc3VsdHMgPSBuZXcgQXJyYXk8TmFtZWRQbHVnaW4+KClcblxuICAgICAgZm9yKGxldCBba2V5LCB2YWx1ZV0gb2YgdGhpcy5yZWdpc3RlcmVkUGx1Z2lucykge1xuICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IGtleSwgcGx1Z2luOiB2YWx1ZVxuICAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgIH1cblxuICAgZ2V0KG5hbWU6IHN0cmluZyk6IElQbHVnaW4gfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJlZFBsdWdpbnMuZ2V0KG5hbWUpXG4gICB9XG5cbiAgIHJlZ2lzdGVyKG5hbWU6IHN0cmluZywgcGx1Z2luOiBJUGx1Z2luKTogdm9pZCB7XG4gICAgICB0aGlzLnJlZ2lzdGVyZWRQbHVnaW5zLnNldChuYW1lLCBwbHVnaW4pXG4gICB9XG59XG5cbmV4cG9ydCBsZXQgR2xvYmFsUGx1Z2lucyA9IG5ldyBGb3JnZUdsb2JhbFBsdWdpbnMoKSJdfQ==