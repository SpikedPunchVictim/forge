"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonStreamOptions = void 0;
const Plugin_1 = require("./Plugin");
const path = require('path');
class JsonStreamOptions {
    constructor(files = new Array(), outFile = '', mode = Plugin_1.StreamMode.Object, space = 0) {
        this.files = files;
        this.outFile = outFile;
        this.mode = mode;
        this.space = space;
    }
    static async fromStep(state, info) {
        let options = new JsonStreamOptions();
        if (info.files) {
            if (!Array.isArray(info.files)) {
                if (typeof info.files !== 'string') {
                    throw new Error(`The 'files' field in a Json Step is incorrect. Expecting a 'string' or a 'string[]', but instead got ${typeof info.fields}`);
                }
            }
            options.files = await state.toAbsolute(info.files);
        }
        if (info.mode) {
            if (typeof info.mode === 'string') {
                switch (info.mode.toLowerCase()) {
                    case 'object': {
                        options.mode = Plugin_1.StreamMode.Object;
                        break;
                    }
                    case 'sax': {
                        options.mode = Plugin_1.StreamMode.Sax;
                        break;
                    }
                    case 'chunk': {
                        options.mode = Plugin_1.StreamMode.Chunk;
                        break;
                    }
                    default: {
                        throw new Error(`Encoutnered unknown 'mode' (${info.mode}) when parsing a JSON step.`);
                    }
                }
            }
            else {
                info.mode = Plugin_1.StreamMode.Object;
            }
        }
        if (info.outFile) {
            if (typeof info.outFile !== 'string') {
                throw new Error(`The 'outFile' specified in a Json step is invalid. It's expected to be a 'string' but got a ${typeof info.outFile} instead.`);
            }
            options.outFile = path.join(state.cwd, info.outFile);
        }
        if (info.space) {
            if (typeof info.space !== 'number') {
                throw new Error(`The 'space' specified in a Json step is invalid. It's expected to be a 'number' but got a ${typeof info.space} instead.`);
            }
            options.space = info.space;
        }
        return options;
    }
}
exports.JsonStreamOptions = JsonStreamOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSnNvblN0cmVhbU9wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSnNvblN0cmVhbU9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscUNBQXFDO0FBQ3JDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUU1QixNQUFhLGlCQUFpQjtJQU0zQixZQUNHLFFBQWtCLElBQUksS0FBSyxFQUFVLEVBQ3JDLFVBQWtCLEVBQUUsRUFDcEIsT0FBbUIsbUJBQVUsQ0FBQyxNQUFNLEVBQ3BDLFFBQWdCLENBQUM7UUFFakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7SUFDckIsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQWtCLEVBQUUsSUFBYztRQUNyRCxJQUFJLE9BQU8sR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUE7UUFFckMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM3QixJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7b0JBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsd0dBQXdHLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7aUJBQy9JO2FBQ0g7WUFFRCxPQUFPLENBQUMsS0FBSyxHQUFHLE1BQU0sS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDcEQ7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWixJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQ2hDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtvQkFDOUIsS0FBSyxRQUFRLENBQUMsQ0FBQzt3QkFDWixPQUFPLENBQUMsSUFBSSxHQUFHLG1CQUFVLENBQUMsTUFBTSxDQUFBO3dCQUNoQyxNQUFLO3FCQUNQO29CQUNELEtBQUssS0FBSyxDQUFDLENBQUM7d0JBQ1QsT0FBTyxDQUFDLElBQUksR0FBRyxtQkFBVSxDQUFDLEdBQUcsQ0FBQTt3QkFDN0IsTUFBSztxQkFDUDtvQkFDRCxLQUFLLE9BQU8sQ0FBQyxDQUFDO3dCQUNYLE9BQU8sQ0FBQyxJQUFJLEdBQUcsbUJBQVUsQ0FBQyxLQUFLLENBQUE7d0JBQy9CLE1BQUs7cUJBQ1A7b0JBQ0QsT0FBTyxDQUFDLENBQUM7d0JBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsSUFBSSxDQUFDLElBQUksNkJBQTZCLENBQUMsQ0FBQTtxQkFDeEY7aUJBQ0g7YUFDSDtpQkFBTTtnQkFDSixJQUFJLENBQUMsSUFBSSxHQUFHLG1CQUFVLENBQUMsTUFBTSxDQUFBO2FBQy9CO1NBQ0g7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZixJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7Z0JBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsK0ZBQStGLE9BQU8sSUFBSSxDQUFDLE9BQU8sV0FBVyxDQUFDLENBQUE7YUFDaEo7WUFFRCxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDdEQ7UUFFRCxJQUFHLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDWixJQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7Z0JBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkZBQTZGLE9BQU8sSUFBSSxDQUFDLEtBQUssV0FBVyxDQUFDLENBQUE7YUFDNUk7WUFFRCxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7U0FDNUI7UUFFRCxPQUFPLE9BQU8sQ0FBQTtJQUNqQixDQUFDO0NBQ0g7QUF6RUQsOENBeUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJ1aWxkU3RhdGUsIFN0ZXBJbmZvIH0gZnJvbSBcIkBzcGlrZWRwdW5jaC9mb3JnZVwiXG5pbXBvcnQgeyBTdHJlYW1Nb2RlIH0gZnJvbSBcIi4vUGx1Z2luXCJcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuZXhwb3J0IGNsYXNzIEpzb25TdHJlYW1PcHRpb25zIHtcbiAgIGZpbGVzOiBzdHJpbmdbXVxuICAgb3V0RmlsZTogc3RyaW5nXG4gICBtb2RlOiBTdHJlYW1Nb2RlXG4gICBzcGFjZTogbnVtYmVyXG5cbiAgIGNvbnN0cnVjdG9yKFxuICAgICAgZmlsZXM6IHN0cmluZ1tdID0gbmV3IEFycmF5PHN0cmluZz4oKSxcbiAgICAgIG91dEZpbGU6IHN0cmluZyA9ICcnLFxuICAgICAgbW9kZTogU3RyZWFtTW9kZSA9IFN0cmVhbU1vZGUuT2JqZWN0LFxuICAgICAgc3BhY2U6IG51bWJlciA9IDBcbiAgICkge1xuICAgICAgdGhpcy5maWxlcyA9IGZpbGVzXG4gICAgICB0aGlzLm91dEZpbGUgPSBvdXRGaWxlXG4gICAgICB0aGlzLm1vZGUgPSBtb2RlXG4gICAgICB0aGlzLnNwYWNlID0gc3BhY2VcbiAgIH1cblxuICAgc3RhdGljIGFzeW5jIGZyb21TdGVwKHN0YXRlOiBJQnVpbGRTdGF0ZSwgaW5mbzogU3RlcEluZm8pOiBQcm9taXNlPEpzb25TdHJlYW1PcHRpb25zPiB7XG4gICAgICBsZXQgb3B0aW9ucyA9IG5ldyBKc29uU3RyZWFtT3B0aW9ucygpXG5cbiAgICAgIGlmIChpbmZvLmZpbGVzKSB7XG4gICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaW5mby5maWxlcykpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5mby5maWxlcyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlICdmaWxlcycgZmllbGQgaW4gYSBKc29uIFN0ZXAgaXMgaW5jb3JyZWN0LiBFeHBlY3RpbmcgYSAnc3RyaW5nJyBvciBhICdzdHJpbmdbXScsIGJ1dCBpbnN0ZWFkIGdvdCAke3R5cGVvZiBpbmZvLmZpZWxkc31gKVxuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuXG4gICAgICAgICBvcHRpb25zLmZpbGVzID0gYXdhaXQgc3RhdGUudG9BYnNvbHV0ZShpbmZvLmZpbGVzKVxuICAgICAgfVxuXG4gICAgICBpZiAoaW5mby5tb2RlKSB7XG4gICAgICAgICBpZiAodHlwZW9mIGluZm8ubW9kZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoaW5mby5tb2RlLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgIGNhc2UgJ29iamVjdCc6IHtcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnMubW9kZSA9IFN0cmVhbU1vZGUuT2JqZWN0XG4gICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgY2FzZSAnc2F4Jzoge1xuICAgICAgICAgICAgICAgICAgb3B0aW9ucy5tb2RlID0gU3RyZWFtTW9kZS5TYXhcbiAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICBjYXNlICdjaHVuayc6IHtcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnMubW9kZSA9IFN0cmVhbU1vZGUuQ2h1bmtcbiAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291dG5lcmVkIHVua25vd24gJ21vZGUnICgke2luZm8ubW9kZX0pIHdoZW4gcGFyc2luZyBhIEpTT04gc3RlcC5gKVxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluZm8ubW9kZSA9IFN0cmVhbU1vZGUuT2JqZWN0XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmZvLm91dEZpbGUpIHtcbiAgICAgICAgIGlmICh0eXBlb2YgaW5mby5vdXRGaWxlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgJ291dEZpbGUnIHNwZWNpZmllZCBpbiBhIEpzb24gc3RlcCBpcyBpbnZhbGlkLiBJdCdzIGV4cGVjdGVkIHRvIGJlIGEgJ3N0cmluZycgYnV0IGdvdCBhICR7dHlwZW9mIGluZm8ub3V0RmlsZX0gaW5zdGVhZC5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBvcHRpb25zLm91dEZpbGUgPSBwYXRoLmpvaW4oc3RhdGUuY3dkLCBpbmZvLm91dEZpbGUpXG4gICAgICB9XG5cbiAgICAgIGlmKGluZm8uc3BhY2UpIHtcbiAgICAgICAgIGlmKHR5cGVvZiBpbmZvLnNwYWNlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgJ3NwYWNlJyBzcGVjaWZpZWQgaW4gYSBKc29uIHN0ZXAgaXMgaW52YWxpZC4gSXQncyBleHBlY3RlZCB0byBiZSBhICdudW1iZXInIGJ1dCBnb3QgYSAke3R5cGVvZiBpbmZvLnNwYWNlfSBpbnN0ZWFkLmApXG4gICAgICAgICB9XG5cbiAgICAgICAgIG9wdGlvbnMuc3BhY2UgPSBpbmZvLnNwYWNlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvcHRpb25zXG4gICB9XG59Il19