"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedPlugin = void 0;
class NamedPlugin {
    constructor(name, plugin) {
        if (name === undefined) {
            throw new Error('Plugin name is must be valid');
        }
        if (plugin === undefined) {
            throw new Error('plugin must be defined');
        }
        this.name = name;
        this.plugin = plugin;
    }
}
exports.NamedPlugin = NamedPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmFtZWRQbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29yZS9OYW1lZFBsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLFdBQVc7SUFJckIsWUFBWSxJQUFZLEVBQUUsTUFBZTtRQUN0QyxJQUFHLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO1NBQ2pEO1FBRUQsSUFBRyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtTQUMzQztRQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0lBQ3ZCLENBQUM7Q0FDSDtBQWhCRCxrQ0FnQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUGx1Z2luIH0gZnJvbSAnLi4vcGx1Z2lucy9JUGx1Z2luJ1xuXG5leHBvcnQgY2xhc3MgTmFtZWRQbHVnaW4ge1xuICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nXG4gICByZWFkb25seSBwbHVnaW46IElQbHVnaW5cblxuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBwbHVnaW46IElQbHVnaW4pIHtcbiAgICAgIGlmKG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbHVnaW4gbmFtZSBpcyBtdXN0IGJlIHZhbGlkJylcbiAgICAgIH1cblxuICAgICAgaWYocGx1Z2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcigncGx1Z2luIG11c3QgYmUgZGVmaW5lZCcpXG4gICAgICB9XG5cbiAgICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luXG4gICB9XG59Il19