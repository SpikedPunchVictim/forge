"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.ForgeOptions = exports.ExportRecord = exports.BuildRecord = void 0;
const ForgeOptions_1 = require("./core/ForgeOptions");
Object.defineProperty(exports, "ForgeOptions", { enumerable: true, get: function () { return ForgeOptions_1.ForgeOptions; } });
const ForgeBuilder_1 = require("./core/ForgeBuilder");
const BuildRecord_1 = require("./core/BuildRecord");
Object.defineProperty(exports, "BuildRecord", { enumerable: true, get: function () { return BuildRecord_1.BuildRecord; } });
Object.defineProperty(exports, "ExportRecord", { enumerable: true, get: function () { return BuildRecord_1.ExportRecord; } });
const ForgeGlobalPlugins_1 = require("./plugins/ForgeGlobalPlugins");
const ForgeBuffer_1 = require("./plugins/ForgeBuffer");
const ForgeStream_1 = require("./plugins/ForgeStream");
const ForgeFn_1 = require("./plugins/ForgeFn");
const ForgeHttpPlugin_1 = require("./plugins/ForgeHttpPlugin");
__exportStar(require("./streams"), exports);
__exportStar(require("./traits"), exports);
__exportStar(require("./utils"), exports);
//-- Global Plugins
ForgeGlobalPlugins_1.GlobalPlugins.register(':buffer', new ForgeBuffer_1.ForgeBuffer());
ForgeGlobalPlugins_1.GlobalPlugins.register(':stream', new ForgeStream_1.ForgeStream());
ForgeGlobalPlugins_1.GlobalPlugins.register(':fn', new ForgeFn_1.ForgeFn());
ForgeGlobalPlugins_1.GlobalPlugins.register(':http', new ForgeHttpPlugin_1.ForgeHttpPlugin());
async function build(config, options = new ForgeOptions_1.ForgeOptions()) {
    let importedConfig = undefined;
    if (typeof config === 'string') {
        importedConfig = await Promise.resolve().then(() => require(config));
    }
    else if (typeof config === 'object') {
        importedConfig = config;
    }
    else {
        throw new Error(`Unsupported config type used ${typeof config}. Expected a string or an object`);
    }
    if (importedConfig == null) {
        throw new Error(`Could not resolve 'config'. Ensure the path or Object is valid.`);
    }
    let normalizedOptions = await ForgeOptions_1.ForgeConfig.normalize(importedConfig, options);
    let builder = new ForgeBuilder_1.ForgeBuilder(normalizedOptions, options);
    builder.on('rate', onRate);
    return builder.build();
}
exports.build = build;
function onRate(obj) {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUVBLHNEQUErRDtBQWtCNUQsNkZBbEJtQiwyQkFBWSxPQWtCbkI7QUFqQmYsc0RBQWtEO0FBQ2xELG9EQUE4RDtBQWMzRCw0RkFkTSx5QkFBVyxPQWNOO0FBQ1gsNkZBZm1CLDBCQUFZLE9BZW5CO0FBWmYscUVBQTREO0FBQzVELHVEQUFtRDtBQUNuRCx1REFBbUQ7QUFDbkQsK0NBQTJDO0FBQzNDLCtEQUEyRDtBQUUzRCw0Q0FBeUI7QUFDekIsMkNBQXdCO0FBQ3hCLDBDQUF1QjtBQWF2QixtQkFBbUI7QUFDbkIsa0NBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUkseUJBQVcsRUFBRSxDQUFDLENBQUE7QUFDcEQsa0NBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUkseUJBQVcsRUFBRSxDQUFDLENBQUE7QUFDcEQsa0NBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksaUJBQU8sRUFBRSxDQUFDLENBQUE7QUFDNUMsa0NBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksaUNBQWUsRUFBRSxDQUFDLENBQUE7QUFFL0MsS0FBSyxVQUFVLEtBQUssQ0FBQyxNQUE0QixFQUFFLFVBQXdCLElBQUksMkJBQVksRUFBRTtJQUNqRyxJQUFJLGNBQWMsR0FBcUMsU0FBUyxDQUFBO0lBQ2hFLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1FBQzdCLGNBQWMsR0FBRywyQ0FBYSxNQUFNLEVBQUMsQ0FBQTtLQUN2QztTQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1FBQ3BDLGNBQWMsR0FBRyxNQUFNLENBQUE7S0FDekI7U0FBTTtRQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLE9BQU8sTUFBTSxrQ0FBa0MsQ0FBQyxDQUFBO0tBQ2xHO0lBRUQsSUFBRyxjQUFjLElBQUksSUFBSSxFQUFFO1FBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUVBQWlFLENBQUMsQ0FBQTtLQUNwRjtJQUVELElBQUksaUJBQWlCLEdBQUcsTUFBTSwwQkFBVyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDNUUsSUFBSSxPQUFPLEdBQUcsSUFBSSwyQkFBWSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQzFELE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQzFCLE9BQU8sT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3pCLENBQUM7QUFsQkQsc0JBa0JDO0FBRUQsU0FBUyxNQUFNLENBQUMsR0FBRztBQUVuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVBsdWdpbiB9IGZyb20gJy4vcGx1Z2lucy9JUGx1Z2luJ1xuaW1wb3J0IHsgSUVudm95IH0gZnJvbSAnLi9wbHVnaW5zL0lFbnZveSdcbmltcG9ydCB7IEZvcmdlQ29uZmlnLCBGb3JnZU9wdGlvbnMgfSBmcm9tICcuL2NvcmUvRm9yZ2VPcHRpb25zJ1xuaW1wb3J0IHsgRm9yZ2VCdWlsZGVyIH0gZnJvbSAnLi9jb3JlL0ZvcmdlQnVpbGRlcidcbmltcG9ydCB7IEJ1aWxkUmVjb3JkLCBFeHBvcnRSZWNvcmQgfSBmcm9tICcuL2NvcmUvQnVpbGRSZWNvcmQnXG5pbXBvcnQgeyBJQnVpbGRTdGF0ZSB9IGZyb20gJy4vY29yZS9CdWlsZFN0YXRlJ1xuaW1wb3J0IHsgSVN0ZXAsIFN0ZXBJbmZvIH0gZnJvbSAnLi9jb3JlL1N0ZXAnXG5pbXBvcnQgeyBHbG9iYWxQbHVnaW5zIH0gZnJvbSAnLi9wbHVnaW5zL0ZvcmdlR2xvYmFsUGx1Z2lucydcbmltcG9ydCB7IEZvcmdlQnVmZmVyIH0gZnJvbSAnLi9wbHVnaW5zL0ZvcmdlQnVmZmVyJ1xuaW1wb3J0IHsgRm9yZ2VTdHJlYW0gfSBmcm9tICcuL3BsdWdpbnMvRm9yZ2VTdHJlYW0nXG5pbXBvcnQgeyBGb3JnZUZuIH0gZnJvbSAnLi9wbHVnaW5zL0ZvcmdlRm4nXG5pbXBvcnQgeyBGb3JnZUh0dHBQbHVnaW4gfSBmcm9tICcuL3BsdWdpbnMvRm9yZ2VIdHRwUGx1Z2luJ1xuXG5leHBvcnQgKiBmcm9tICcuL3N0cmVhbXMnXG5leHBvcnQgKiBmcm9tICcuL3RyYWl0cydcbmV4cG9ydCAqIGZyb20gJy4vdXRpbHMnXG5cbmV4cG9ydCB7XG4gICBCdWlsZFJlY29yZCxcbiAgIEV4cG9ydFJlY29yZCxcbiAgIEZvcmdlT3B0aW9ucyxcbiAgIElCdWlsZFN0YXRlLFxuICAgSUVudm95LFxuICAgSVBsdWdpbixcbiAgIElTdGVwLFxuICAgU3RlcEluZm9cbn1cblxuLy8tLSBHbG9iYWwgUGx1Z2luc1xuR2xvYmFsUGx1Z2lucy5yZWdpc3RlcignOmJ1ZmZlcicsIG5ldyBGb3JnZUJ1ZmZlcigpKVxuR2xvYmFsUGx1Z2lucy5yZWdpc3RlcignOnN0cmVhbScsIG5ldyBGb3JnZVN0cmVhbSgpKVxuR2xvYmFsUGx1Z2lucy5yZWdpc3RlcignOmZuJywgbmV3IEZvcmdlRm4oKSlcbkdsb2JhbFBsdWdpbnMucmVnaXN0ZXIoJzpodHRwJywgbmV3IEZvcmdlSHR0cFBsdWdpbigpKVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVpbGQoY29uZmlnOiBGb3JnZUNvbmZpZyB8IHN0cmluZywgb3B0aW9uczogRm9yZ2VPcHRpb25zID0gbmV3IEZvcmdlT3B0aW9ucygpKTogUHJvbWlzZTxCdWlsZFJlY29yZD4ge1xuICAgbGV0IGltcG9ydGVkQ29uZmlnOiBGb3JnZUNvbmZpZyB8IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpbXBvcnRlZENvbmZpZyA9IGF3YWl0IGltcG9ydChjb25maWcpXG4gICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnKSB7XG4gICAgICBpbXBvcnRlZENvbmZpZyA9IGNvbmZpZ1xuICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgY29uZmlnIHR5cGUgdXNlZCAke3R5cGVvZiBjb25maWd9LiBFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBvYmplY3RgKVxuICAgfVxuXG4gICBpZihpbXBvcnRlZENvbmZpZyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCByZXNvbHZlICdjb25maWcnLiBFbnN1cmUgdGhlIHBhdGggb3IgT2JqZWN0IGlzIHZhbGlkLmApXG4gICB9XG5cbiAgIGxldCBub3JtYWxpemVkT3B0aW9ucyA9IGF3YWl0IEZvcmdlQ29uZmlnLm5vcm1hbGl6ZShpbXBvcnRlZENvbmZpZywgb3B0aW9ucylcbiAgIGxldCBidWlsZGVyID0gbmV3IEZvcmdlQnVpbGRlcihub3JtYWxpemVkT3B0aW9ucywgb3B0aW9ucylcbiAgIGJ1aWxkZXIub24oJ3JhdGUnLCBvblJhdGUpXG4gICByZXR1cm4gYnVpbGRlci5idWlsZCgpXG59XG5cbmZ1bmN0aW9uIG9uUmF0ZShvYmopIHtcblxufSJdfQ==