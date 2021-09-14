"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Search = void 0;
class Search {
    constructor(globalPlugins) {
        this.globalPlugins = globalPlugins;
    }
    /**
     * Find a plugin from the perspective of a Transform
     *
     * @param name The name of the plugin
     * @param transform The tansform
     */
    findPlugin(name, transform) {
        let found = transform.findPlugin(name);
        if (found) {
            return found;
        }
        return this.globalPlugins.find(plugin => plugin.name.toLowerCase() === name.toLowerCase());
    }
}
exports.Search = Search;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VhcmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvU2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLE1BQWEsTUFBTTtJQUdoQixZQUFZLGFBQWlDO1FBQzFDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFBO0lBQ3JDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFVBQVUsQ0FBQyxJQUFZLEVBQUUsU0FBeUI7UUFDL0MsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUV0QyxJQUFHLEtBQUssRUFBRTtZQUNQLE9BQU8sS0FBSyxDQUFBO1NBQ2Q7UUFFRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtJQUM3RixDQUFDO0NBQ0g7QUF0QkQsd0JBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmFtZWRQbHVnaW4gfSBmcm9tIFwiLi9OYW1lZFBsdWdpblwiO1xuaW1wb3J0IHsgSUZvcmdlUGlwZWxpbmUgfSBmcm9tIFwiLi9Gb3JnZVRyYW5zZm9ybVwiO1xuXG5leHBvcnQgY2xhc3MgU2VhcmNoIHtcbiAgIHByaXZhdGUgZ2xvYmFsUGx1Z2luczogQXJyYXk8TmFtZWRQbHVnaW4+XG5cbiAgIGNvbnN0cnVjdG9yKGdsb2JhbFBsdWdpbnM6IEFycmF5PE5hbWVkUGx1Z2luPikge1xuICAgICAgdGhpcy5nbG9iYWxQbHVnaW5zID0gZ2xvYmFsUGx1Z2luc1xuICAgfVxuXG4gICAvKipcbiAgICAqIEZpbmQgYSBwbHVnaW4gZnJvbSB0aGUgcGVyc3BlY3RpdmUgb2YgYSBUcmFuc2Zvcm1cbiAgICAqIFxuICAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIHBsdWdpblxuICAgICogQHBhcmFtIHRyYW5zZm9ybSBUaGUgdGFuc2Zvcm1cbiAgICAqL1xuICAgZmluZFBsdWdpbihuYW1lOiBzdHJpbmcsIHRyYW5zZm9ybTogSUZvcmdlUGlwZWxpbmUpIHtcbiAgICAgIGxldCBmb3VuZCA9IHRyYW5zZm9ybS5maW5kUGx1Z2luKG5hbWUpXG5cbiAgICAgIGlmKGZvdW5kKSB7XG4gICAgICAgICByZXR1cm4gZm91bmRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2xvYmFsUGx1Z2lucy5maW5kKHBsdWdpbiA9PiBwbHVnaW4ubmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lLnRvTG93ZXJDYXNlKCkpXG4gICB9XG59Il19