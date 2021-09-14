"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeHttpPlugin = void 0;
const url_1 = require("url");
const readable_stream_1 = require("readable-stream");
const http = require("http");
const https = require("https");
class HttpReadStream extends readable_stream_1.Readable {
    constructor(requestOptions, streamOptions) {
        super(streamOptions);
        this.requestOptions = requestOptions;
    }
    _read() {
        let protocol = this.requestOptions.protocol == null ? 'https:' : this.requestOptions.protocol.toLowerCase();
        let httpProtocol = protocol === 'http:' ? http : https;
        try {
            let req = httpProtocol.request(this.requestOptions, async (res) => {
                let chunks = new Array();
                let length = 0;
                let results = undefined;
                let rawBody = undefined;
                for await (let chunk of res) {
                    chunks.push(chunk);
                    length += Buffer.byteLength(chunk);
                }
                if (Buffer.isBuffer(chunks[0])) {
                    rawBody = Buffer.concat(chunks, length);
                }
                else {
                    rawBody = Buffer.from(chunks.join(''));
                }
                let contentType = res.headers['content-type'] || '';
                if (contentType.toLowerCase().indexOf('application/json') >= 0) {
                    results = JSON.parse(rawBody.toString('utf8'));
                }
                else {
                    results = rawBody;
                }
                this.push(results);
                this.push(null);
            });
            req.end();
        }
        catch (err) {
            this.destroy(err);
        }
    }
}
// class HttpWriteStream extends Transform {
//    readonly requestOptions: RequestOptions
//    constructor(requestOptions: RequestOptions, streamOptions: TransformOptions) {
//       super(streamOptions)
//       this.requestOptions = requestOptions
//    }
//    _transform(chunk: any, encoding: string, cb: (error?: Error | undefined, data?: any) => void): void {
//    }
// }
class ForgeHttpPlugin {
    constructor() {
        this.name = ForgeHttpPlugin.type;
    }
    /*
            protocol?: string | null;
            host?: string | null;
            hostname?: string | null;
            family?: number;
            port?: number | string | null;
            defaultPort?: number | string;
            localAddress?: string;
            socketPath?: string;
            method?: string;
            path?: string | null;
            headers?: OutgoingHttpHeaders;
            auth?: string | null;
            agent?: Agent | boolean;
            _defaultAgent?: Agent;
            timeout?: number;
            setHost?: boolean;
    */
    /*
       alias: '..',
       plugin: ':rest',
       verb: 'get' // post, put, delete,
       headers: {
          ...
       },
       // If set, puts the stream in Object Mode
       objectMode: true|false  // default true
       // These options override any previously set options
       options: // RequestOptions,
       streamOptions: {}    // ReadableOptions
    */
    /**
     *
     *
     *
     *
     * @param state
     * @param step
     * @returns
     */
    async read(state, step) {
        let { info } = step;
        let requestOptions = {};
        let streamOptions = {};
        /*
           xform.options(info, {
              url: {
                 type: 'string',
                 exists: (url) => {
                    let url = new URL(info.url)
                    requestOptions.protocol = url.protocol
                    requestOptions.host = url.host
                    requestOptions.path = url.pathname
                    requestOptions.port = (url.port === '' || url.port == null) ? (
                       url.protocol === 'https:' ? 443 : 80
                    ) : url.port
                 }
              },
              verb: {
                 type: 'string',
                 options: ['GET', 'POST', 'PUT', 'DELETE'],
                 exists: verb => requestOptions.method = info.verb
                 default: () => requestOptions.method = 'GET'
              },
              headers: {
                 type: 'object',
                 exists: headers => requestOptions.headers = info.headers
              },
              options: {
                 type: 'object',
                 exists: options => {
                    requestOptions = {
                       ...requestOptions,
                       ...info.options
                    }
                 }
              },
              objectMode: {
                 type: ['string', 'boolean'],
                 exists: (objectMode, { switch }) => {
                    switch.type(objectMode)
                       .case('string', () => streamOptions.objectMode = info.objectMode.toLowerCase() === 'true')
                       .case('boolean', () => streamOptions.objectMode = info.objectMode)
                       .default(() => throw new Error())
                 }
              }
           })
  
        */
        if (info.url != null) {
            let url = new url_1.URL(info.url);
            requestOptions.protocol = url.protocol;
            requestOptions.host = url.host;
            requestOptions.path = url.pathname;
            requestOptions.port = (url.port === '' || url.port == null) ? (url.protocol === 'https:' ? 443 : 80) : url.port;
        }
        if (info.verb != null) {
            requestOptions.method = info.verb;
        }
        else {
            requestOptions.method = 'GET';
        }
        if (info.headers != null) {
            requestOptions.headers = info.headers;
        }
        if (info.options != null) {
            requestOptions = {
                ...requestOptions,
                ...info.options
            };
        }
        if (info.objectMode != null) {
            if (typeof info.objectMode === 'string') {
                streamOptions.objectMode = info.objectMode.toLowerCase() === 'true';
            }
            else if (typeof info.objectMode === 'boolean') {
                streamOptions.objectMode = info.objectMode;
            }
            else {
                throw new Error(`'objectMode' is expected to be a string or a boolean. Received ${typeof info.objectMode} instead.`);
            }
        }
        else {
            streamOptions.objectMode = true;
        }
        if (info.streamOptions != null) {
            streamOptions = {
                ...streamOptions,
                ...info.streamOptions
            };
        }
        return new HttpReadStream(requestOptions, streamOptions);
    }
    async write(state, step) {
        throw new Error(`No Envoy is supported for the ${ForgeHttpPlugin.type}`);
    }
    async transform(state, step) {
        throw new Error(`No Envoy is supported for the ${ForgeHttpPlugin.type}`);
    }
}
exports.ForgeHttpPlugin = ForgeHttpPlugin;
ForgeHttpPlugin.type = 'forge-internal-rest-plugin';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yZ2VIdHRwUGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BsdWdpbnMvRm9yZ2VIdHRwUGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF5QjtBQUN6QixxREFBZ0Y7QUFJaEYsNkJBQTRCO0FBQzVCLCtCQUE4QjtBQUc5QixNQUFNLGNBQWUsU0FBUSwwQkFBUTtJQUdsQyxZQUFZLGNBQThCLEVBQUUsYUFBOEI7UUFDdkUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ3BCLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFBO0lBQ3ZDLENBQUM7SUFFRCxLQUFLO1FBQ0YsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQzNHLElBQUksWUFBWSxHQUFHLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO1FBRXRELElBQUk7WUFDRCxJQUFJLEdBQUcsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUMvRCxJQUFJLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBTyxDQUFBO2dCQUM3QixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUE7Z0JBQ2QsSUFBSSxPQUFPLEdBQWdDLFNBQVMsQ0FBQTtnQkFDcEQsSUFBSSxPQUFPLEdBQXVCLFNBQVMsQ0FBQTtnQkFFM0MsSUFBSSxLQUFLLEVBQUUsSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFO29CQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUNsQixNQUFNLElBQUksTUFBTSxDQUFDLFVBQVUs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SUFBVztRQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUMzRSxDQUFDOztBQXpKSiwwQ0EwSkM7QUF6SmtCLG9CQUFJLEdBQVcsNEJBQTRCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVUkwgfSBmcm9tICd1cmwnXG5pbXBvcnQgeyBSZWFkYWJsZSwgUmVhZGFibGVPcHRpb25zLCBUcmFuc2Zvcm0sIFdyaXRhYmxlIH0gZnJvbSBcInJlYWRhYmxlLXN0cmVhbVwiXG5pbXBvcnQgeyBJQnVpbGRTdGF0ZSB9IGZyb20gXCIuLi9jb3JlL0J1aWxkU3RhdGVcIlxuaW1wb3J0IHsgSVN0ZXAgfSBmcm9tIFwiLi4vY29yZS9TdGVwXCJcbmltcG9ydCB7IElQbHVnaW4gfSBmcm9tIFwiLi9JUGx1Z2luXCJcbmltcG9ydCAqIGFzIGh0dHAgZnJvbSBcImh0dHBcIlxuaW1wb3J0ICogYXMgaHR0cHMgZnJvbSBcImh0dHBzXCJcbmltcG9ydCB7IFJlcXVlc3RPcHRpb25zIH0gZnJvbSBcImh0dHBzXCJcblxuY2xhc3MgSHR0cFJlYWRTdHJlYW0gZXh0ZW5kcyBSZWFkYWJsZSB7XG4gICByZWFkb25seSByZXF1ZXN0T3B0aW9uczogUmVxdWVzdE9wdGlvbnNcblxuICAgY29uc3RydWN0b3IocmVxdWVzdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zLCBzdHJlYW1PcHRpb25zOiBSZWFkYWJsZU9wdGlvbnMpIHtcbiAgICAgIHN1cGVyKHN0cmVhbU9wdGlvbnMpXG4gICAgICB0aGlzLnJlcXVlc3RPcHRpb25zID0gcmVxdWVzdE9wdGlvbnNcbiAgIH1cblxuICAgX3JlYWQoKTogdm9pZCB7XG4gICAgICBsZXQgcHJvdG9jb2wgPSB0aGlzLnJlcXVlc3RPcHRpb25zLnByb3RvY29sID09IG51bGwgPyAnaHR0cHM6JyA6IHRoaXMucmVxdWVzdE9wdGlvbnMucHJvdG9jb2wudG9Mb3dlckNhc2UoKVxuICAgICAgbGV0IGh0dHBQcm90b2NvbCA9IHByb3RvY29sID09PSAnaHR0cDonID8gaHR0cCA6IGh0dHBzXG5cbiAgICAgIHRyeSB7XG4gICAgICAgICBsZXQgcmVxID0gaHR0cFByb3RvY29sLnJlcXVlc3QodGhpcy5yZXF1ZXN0T3B0aW9ucywgYXN5bmMgKHJlcykgPT4ge1xuICAgICAgICAgICAgbGV0IGNodW5rcyA9IG5ldyBBcnJheTxhbnk+KClcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSAwXG4gICAgICAgICAgICBsZXQgcmVzdWx0czogc3RyaW5nIHwgQnVmZmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4gICAgICAgICAgICBsZXQgcmF3Qm9keTogQnVmZmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgICAgICAgICAgIGZvciBhd2FpdCAobGV0IGNodW5rIG9mIHJlcykge1xuICAgICAgICAgICAgICAgY2h1bmtzLnB1c2goY2h1bmspXG4gICAgICAgICAgICAgICBsZW5ndGggKz0gQnVmZmVyLmJ5dGVMZW5ndGgoY2h1bmspXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoY2h1bmtzWzBdKSkge1xuICAgICAgICAgICAgICAgcmF3Qm9keSA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzLCBsZW5ndGgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgcmF3Qm9keSA9IEJ1ZmZlci5mcm9tKGNodW5rcy5qb2luKCcnKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNvbnRlbnRUeXBlID0gcmVzLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddIHx8ICcnXG5cbiAgICAgICAgICAgIGlmIChjb250ZW50VHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2FwcGxpY2F0aW9uL2pzb24nKSA+PSAwKSB7XG4gICAgICAgICAgICAgICByZXN1bHRzID0gSlNPTi5wYXJzZShyYXdCb2R5LnRvU3RyaW5nKCd1dGY4JykpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgcmVzdWx0cyA9IHJhd0JvZHlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wdXNoKHJlc3VsdHMpXG4gICAgICAgICAgICB0aGlzLnB1c2gobnVsbClcbiAgICAgICAgIH0pXG5cbiAgICAgICAgIHJlcS5lbmQoKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICB0aGlzLmRlc3Ryb3koZXJyKVxuICAgICAgfVxuICAgfVxufVxuXG4vLyBjbGFzcyBIdHRwV3JpdGVTdHJlYW0gZXh0ZW5kcyBUcmFuc2Zvcm0ge1xuLy8gICAgcmVhZG9ubHkgcmVxdWVzdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zXG5cbi8vICAgIGNvbnN0cnVjdG9yKHJlcXVlc3RPcHRpb25zOiBSZXF1ZXN0T3B0aW9ucywgc3RyZWFtT3B0aW9uczogVHJhbnNmb3JtT3B0aW9ucykge1xuLy8gICAgICAgc3VwZXIoc3RyZWFtT3B0aW9ucylcbi8vICAgICAgIHRoaXMucmVxdWVzdE9wdGlvbnMgPSByZXF1ZXN0T3B0aW9uc1xuLy8gICAgfVxuXG4vLyAgICBfdHJhbnNmb3JtKGNodW5rOiBhbnksIGVuY29kaW5nOiBzdHJpbmcsIGNiOiAoZXJyb3I/OiBFcnJvciB8IHVuZGVmaW5lZCwgZGF0YT86IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgXG4vLyAgICB9XG4vLyB9XG5cbmV4cG9ydCBjbGFzcyBGb3JnZUh0dHBQbHVnaW4gaW1wbGVtZW50cyBJUGx1Z2luIHtcbiAgIHN0YXRpYyByZWFkb25seSB0eXBlOiBzdHJpbmcgPSAnZm9yZ2UtaW50ZXJuYWwtcmVzdC1wbHVnaW4nXG4gICByZWFkb25seSBuYW1lOiBzdHJpbmcgPSBGb3JnZUh0dHBQbHVnaW4udHlwZVxuXG5cbiAgIC8qXG4gICAgICAgICAgIHByb3RvY29sPzogc3RyaW5nIHwgbnVsbDtcbiAgICAgICAgICAgaG9zdD86IHN0cmluZyB8IG51bGw7XG4gICAgICAgICAgIGhvc3RuYW1lPzogc3RyaW5nIHwgbnVsbDtcbiAgICAgICAgICAgZmFtaWx5PzogbnVtYmVyO1xuICAgICAgICAgICBwb3J0PzogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbDtcbiAgICAgICAgICAgZGVmYXVsdFBvcnQ/OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgICAgICAgIGxvY2FsQWRkcmVzcz86IHN0cmluZztcbiAgICAgICAgICAgc29ja2V0UGF0aD86IHN0cmluZztcbiAgICAgICAgICAgbWV0aG9kPzogc3RyaW5nO1xuICAgICAgICAgICBwYXRoPzogc3RyaW5nIHwgbnVsbDtcbiAgICAgICAgICAgaGVhZGVycz86IE91dGdvaW5nSHR0cEhlYWRlcnM7XG4gICAgICAgICAgIGF1dGg/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgICAgICBhZ2VudD86IEFnZW50IHwgYm9vbGVhbjtcbiAgICAgICAgICAgX2RlZmF1bHRBZ2VudD86IEFnZW50O1xuICAgICAgICAgICB0aW1lb3V0PzogbnVtYmVyO1xuICAgICAgICAgICBzZXRIb3N0PzogYm9vbGVhbjtcbiAgICovXG5cbiAgIC8qXG4gICAgICBhbGlhczogJy4uJyxcbiAgICAgIHBsdWdpbjogJzpyZXN0JyxcbiAgICAgIHZlcmI6ICdnZXQnIC8vIHBvc3QsIHB1dCwgZGVsZXRlLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAgLi4uXG4gICAgICB9LFxuICAgICAgLy8gSWYgc2V0LCBwdXRzIHRoZSBzdHJlYW0gaW4gT2JqZWN0IE1vZGVcbiAgICAgIG9iamVjdE1vZGU6IHRydWV8ZmFsc2UgIC8vIGRlZmF1bHQgdHJ1ZVxuICAgICAgLy8gVGhlc2Ugb3B0aW9ucyBvdmVycmlkZSBhbnkgcHJldmlvdXNseSBzZXQgb3B0aW9uc1xuICAgICAgb3B0aW9uczogLy8gUmVxdWVzdE9wdGlvbnMsXG4gICAgICBzdHJlYW1PcHRpb25zOiB7fSAgICAvLyBSZWFkYWJsZU9wdGlvbnNcbiAgICovXG5cbiAgIC8qKlxuICAgICogXG4gICAgKiBcbiAgICAqIFxuICAgICogXG4gICAgKiBAcGFyYW0gc3RhdGUgXG4gICAgKiBAcGFyYW0gc3RlcCBcbiAgICAqIEByZXR1cm5zIFxuICAgICovXG4gICBhc3luYyByZWFkKHN0YXRlOiBJQnVpbGRTdGF0ZSwgc3RlcDogSVN0ZXApOiBQcm9taXNlPFJlYWRhYmxlPiB7XG4gICAgICBsZXQgeyBpbmZvIH0gPSBzdGVwXG4gICAgICBsZXQgcmVxdWVzdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zID0ge31cbiAgICAgIGxldCBzdHJlYW1PcHRpb25zOiBSZWFkYWJsZU9wdGlvbnMgPSB7fVxuXG4gICAgICAvKlxuICAgICAgICAgeGZvcm0ub3B0aW9ucyhpbmZvLCB7XG4gICAgICAgICAgICB1cmw6IHtcbiAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgZXhpc3RzOiAodXJsKSA9PiB7XG4gICAgICAgICAgICAgICAgICBsZXQgdXJsID0gbmV3IFVSTChpbmZvLnVybClcbiAgICAgICAgICAgICAgICAgIHJlcXVlc3RPcHRpb25zLnByb3RvY29sID0gdXJsLnByb3RvY29sXG4gICAgICAgICAgICAgICAgICByZXF1ZXN0T3B0aW9ucy5ob3N0ID0gdXJsLmhvc3RcbiAgICAgICAgICAgICAgICAgIHJlcXVlc3RPcHRpb25zLnBhdGggPSB1cmwucGF0aG5hbWVcbiAgICAgICAgICAgICAgICAgIHJlcXVlc3RPcHRpb25zLnBvcnQgPSAodXJsLnBvcnQgPT09ICcnIHx8IHVybC5wb3J0ID09IG51bGwpID8gKFxuICAgICAgICAgICAgICAgICAgICAgdXJsLnByb3RvY29sID09PSAnaHR0cHM6JyA/IDQ0MyA6IDgwXG4gICAgICAgICAgICAgICAgICApIDogdXJsLnBvcnRcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2ZXJiOiB7XG4gICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgIG9wdGlvbnM6IFsnR0VUJywgJ1BPU1QnLCAnUFVUJywgJ0RFTEVURSddLFxuICAgICAgICAgICAgICAgZXhpc3RzOiB2ZXJiID0+IHJlcXVlc3RPcHRpb25zLm1ldGhvZCA9IGluZm8udmVyYlxuICAgICAgICAgICAgICAgZGVmYXVsdDogKCkgPT4gcmVxdWVzdE9wdGlvbnMubWV0aG9kID0gJ0dFVCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgIGV4aXN0czogaGVhZGVycyA9PiByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0gaW5mby5oZWFkZXJzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICBleGlzdHM6IG9wdGlvbnMgPT4ge1xuICAgICAgICAgICAgICAgICAgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAuLi5yZXF1ZXN0T3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgIC4uLmluZm8ub3B0aW9uc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9iamVjdE1vZGU6IHtcbiAgICAgICAgICAgICAgIHR5cGU6IFsnc3RyaW5nJywgJ2Jvb2xlYW4nXSxcbiAgICAgICAgICAgICAgIGV4aXN0czogKG9iamVjdE1vZGUsIHsgc3dpdGNoIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgIHN3aXRjaC50eXBlKG9iamVjdE1vZGUpXG4gICAgICAgICAgICAgICAgICAgICAuY2FzZSgnc3RyaW5nJywgKCkgPT4gc3RyZWFtT3B0aW9ucy5vYmplY3RNb2RlID0gaW5mby5vYmplY3RNb2RlLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJylcbiAgICAgICAgICAgICAgICAgICAgIC5jYXNlKCdib29sZWFuJywgKCkgPT4gc3RyZWFtT3B0aW9ucy5vYmplY3RNb2RlID0gaW5mby5vYmplY3RNb2RlKVxuICAgICAgICAgICAgICAgICAgICAgLmRlZmF1bHQoKCkgPT4gdGhyb3cgbmV3IEVycm9yKCkpXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICB9KVxuXG4gICAgICAqL1xuXG4gICAgICBpZiAoaW5mby51cmwgIT0gbnVsbCkge1xuICAgICAgICAgbGV0IHVybCA9IG5ldyBVUkwoaW5mby51cmwpXG4gICAgICAgICByZXF1ZXN0T3B0aW9ucy5wcm90b2NvbCA9IHVybC5wcm90b2NvbFxuICAgICAgICAgcmVxdWVzdE9wdGlvbnMuaG9zdCA9IHVybC5ob3N0XG4gICAgICAgICByZXF1ZXN0T3B0aW9ucy5wYXRoID0gdXJsLnBhdGhuYW1lXG4gICAgICAgICByZXF1ZXN0T3B0aW9ucy5wb3J0ID0gKHVybC5wb3J0ID09PSAnJyB8fCB1cmwucG9ydCA9PSBudWxsKSA/IChcbiAgICAgICAgICAgIHVybC5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyA0NDMgOiA4MFxuICAgICAgICAgKSA6IHVybC5wb3J0XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmZvLnZlcmIgIT0gbnVsbCkge1xuICAgICAgICAgcmVxdWVzdE9wdGlvbnMubWV0aG9kID0gaW5mby52ZXJiXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmVxdWVzdE9wdGlvbnMubWV0aG9kID0gJ0dFVCdcbiAgICAgIH1cblxuICAgICAgaWYgKGluZm8uaGVhZGVycyAhPSBudWxsKSB7XG4gICAgICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0gaW5mby5oZWFkZXJzXG4gICAgICB9XG5cbiAgICAgIGlmIChpbmZvLm9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICAgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAuLi5yZXF1ZXN0T3B0aW9ucyxcbiAgICAgICAgICAgIC4uLmluZm8ub3B0aW9uc1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZihpbmZvLm9iamVjdE1vZGUgIT0gbnVsbCkge1xuICAgICAgICAgaWYodHlwZW9mIGluZm8ub2JqZWN0TW9kZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHN0cmVhbU9wdGlvbnMub2JqZWN0TW9kZSA9IGluZm8ub2JqZWN0TW9kZS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSdcbiAgICAgICAgIH0gZWxzZSBpZih0eXBlb2YgaW5mby5vYmplY3RNb2RlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHN0cmVhbU9wdGlvbnMub2JqZWN0TW9kZSA9IGluZm8ub2JqZWN0TW9kZVxuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJ29iamVjdE1vZGUnIGlzIGV4cGVjdGVkIHRvIGJlIGEgc3RyaW5nIG9yIGEgYm9vbGVhbi4gUmVjZWl2ZWQgJHt0eXBlb2YgaW5mby5vYmplY3RNb2RlfSBpbnN0ZWFkLmApXG4gICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgc3RyZWFtT3B0aW9ucy5vYmplY3RNb2RlID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZihpbmZvLnN0cmVhbU9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICAgc3RyZWFtT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIC4uLnN0cmVhbU9wdGlvbnMsXG4gICAgICAgICAgICAuLi5pbmZvLnN0cmVhbU9wdGlvbnNcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBIdHRwUmVhZFN0cmVhbShyZXF1ZXN0T3B0aW9ucywgc3RyZWFtT3B0aW9ucylcbiAgIH1cblxuICAgYXN5bmMgd3JpdGUoc3RhdGU6IElCdWlsZFN0YXRlLCBzdGVwOiBJU3RlcCk6IFByb21pc2U8V3JpdGFibGU+IHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gRW52b3kgaXMgc3VwcG9ydGVkIGZvciB0aGUgJHtGb3JnZUh0dHBQbHVnaW4udHlwZX1gKVxuICAgfVxuXG4gICBhc3luYyB0cmFuc2Zvcm0oc3RhdGU6IElCdWlsZFN0YXRlLCBzdGVwOiBJU3RlcCk6IFByb21pc2U8VHJhbnNmb3JtPiB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIEVudm95IGlzIHN1cHBvcnRlZCBmb3IgdGhlICR7Rm9yZ2VIdHRwUGx1Z2luLnR5cGV9YClcbiAgIH1cbn0iXX0=