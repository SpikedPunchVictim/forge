"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigBuilder = void 0;
const fs = require('fs-extra');
class ConfigBuilder {
    constructor() {
    }
    /**
     * Retrieves an environment variable, or returns a default value if it doesn't exist
     *
     * @param envVar The environment variable to use
     * @param def The default value if the environment variable doesn't exist
     */
    env(envVar, def) {
        return process.env[envVar] == null ? def : process.env[envVar];
    }
    /**
     * Reads in a jsonFile
     *
     * @param filePath The path to the JSON file
     */
    async jsonFile(filePath) {
        return fs.readJson(filePath);
    }
    /**
     * Reads in a JSON file whose path is provided in an environment variable,
     * or a default location if the environment variable doesn't exist.
     *
     * @param envVar The environment variable
     * @param def The efault value if the environment variable doesn't exist
     */
    async jsonFileEnv(envVar, def) {
        return process.env[envVar] == null ? fs.readJson(def) : fs.readJson(process.env[envVar]);
    }
}
exports.ConfigBuilder = ConfigBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlnQnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL0NvbmZpZ0J1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBUTlCLE1BQWEsYUFBYTtJQUN2QjtJQUVBLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEdBQUcsQ0FBQyxNQUFjLEVBQUUsR0FBVztRQUM1QixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFXLENBQUE7SUFDM0UsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQWdCO1FBQzVCLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUMvQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFjLEVBQUUsR0FBVztRQUMxQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUMzRixDQUFDO0NBQ0g7QUFsQ0Qsc0NBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZnMgPSByZXF1aXJlKCdmcy1leHRyYScpXG5cbmV4cG9ydCB0eXBlIEdlbmVyaWNPYmplY3QgPSB7XG4gICBba2V5OiBzdHJpbmddOiBhbnlcbn1cblxuZXhwb3J0IHR5cGUgQnVpbGRDb25maWdGbiA9IChidWlsZGVyOiBDb25maWdCdWlsZGVyKSA9PiBQcm9taXNlPEdlbmVyaWNPYmplY3Q+XG5cbmV4cG9ydCBjbGFzcyBDb25maWdCdWlsZGVyIHtcbiAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICB9XG5cbiAgIC8qKlxuICAgICogUmV0cmlldmVzIGFuIGVudmlyb25tZW50IHZhcmlhYmxlLCBvciByZXR1cm5zIGEgZGVmYXVsdCB2YWx1ZSBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgKiBcbiAgICAqIEBwYXJhbSBlbnZWYXIgVGhlIGVudmlyb25tZW50IHZhcmlhYmxlIHRvIHVzZVxuICAgICogQHBhcmFtIGRlZiBUaGUgZGVmYXVsdCB2YWx1ZSBpZiB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGUgZG9lc24ndCBleGlzdFxuICAgICovXG4gICBlbnYoZW52VmFyOiBzdHJpbmcsIGRlZjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBwcm9jZXNzLmVudltlbnZWYXJdID09IG51bGwgPyBkZWYgOiBwcm9jZXNzLmVudltlbnZWYXJdIGFzIHN0cmluZ1xuICAgfVxuXG4gICAvKipcbiAgICAqIFJlYWRzIGluIGEganNvbkZpbGVcbiAgICAqIFxuICAgICogQHBhcmFtIGZpbGVQYXRoIFRoZSBwYXRoIHRvIHRoZSBKU09OIGZpbGVcbiAgICAqL1xuICAgYXN5bmMganNvbkZpbGUoZmlsZVBhdGg6IHN0cmluZyk6IFByb21pc2U8R2VuZXJpY09iamVjdD4ge1xuICAgICAgcmV0dXJuIGZzLnJlYWRKc29uKGZpbGVQYXRoKVxuICAgfVxuXG4gICAvKipcbiAgICAqIFJlYWRzIGluIGEgSlNPTiBmaWxlIHdob3NlIHBhdGggaXMgcHJvdmlkZWQgaW4gYW4gZW52aXJvbm1lbnQgdmFyaWFibGUsXG4gICAgKiBvciBhIGRlZmF1bHQgbG9jYXRpb24gaWYgdGhlIGVudmlyb25tZW50IHZhcmlhYmxlIGRvZXNuJ3QgZXhpc3QuXG4gICAgKlxuICAgICogQHBhcmFtIGVudlZhciBUaGUgZW52aXJvbm1lbnQgdmFyaWFibGVcbiAgICAqIEBwYXJhbSBkZWYgVGhlIGVmYXVsdCB2YWx1ZSBpZiB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGUgZG9lc24ndCBleGlzdFxuICAgICovXG4gICBhc3luYyBqc29uRmlsZUVudihlbnZWYXI6IHN0cmluZywgZGVmOiBzdHJpbmcpOiBQcm9taXNlPEdlbmVyaWNPYmplY3Q+IHtcbiAgICAgIHJldHVybiBwcm9jZXNzLmVudltlbnZWYXJdID09IG51bGwgPyBmcy5yZWFkSnNvbihkZWYpIDogZnMucmVhZEpzb24ocHJvY2Vzcy5lbnZbZW52VmFyXSlcbiAgIH1cbn0iXX0=