"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailReadableStream = void 0;
const readable_stream_1 = require("readable-stream");
const googleapis_1 = require("googleapis");
class GmailReadableStream extends readable_stream_1.Readable {
    constructor(readOptions, authClient, userId, options) {
        super({
            ...options,
            objectMode: true
        });
        this.pageToken = undefined;
        this.options = readOptions;
        this.auth = authClient;
        this.userId = userId;
        this.messageIds = new Array();
        this.finished = false;
        this.gmail = googleapis_1.google.gmail({
            version: 'v1',
            auth: authClient
        });
    }
    async _read() {
        var _a, _b;
        try {
            let rateLimiter = this.options.rateLimiter;
            let id = this.messageIds.shift();
            if (id === undefined) {
                this.messageIds = await this.getNextMessageIds();
                id = this.messageIds.shift();
                if (id === undefined) {
                    this.push(null);
                    return;
                }
            }
            let message = await rateLimiter.async(5, 
            //@ts-ignore
            () => this.gmail.users.messages.get({
                userId: this.userId,
                id
            }));
            let data = message.data;
            let attachments = new Array();
            // Pull attachments if needed
            if (this.options.includeAttachments) {
                for (let part of ((_a = data.payload) === null || _a === void 0 ? void 0 : _a.parts) || []) {
                    let attachmentId = (_b = part.body) === null || _b === void 0 ? void 0 : _b.attachmentId;
                    if (part.filename == null || part.filename === '') {
                        continue;
                    }
                    if (attachmentId === null || attachmentId === undefined) {
                        continue;
                    }
                    let attachment = await rateLimiter.async(5, () => {
                        return this.gmail.users.messages.attachments.get({
                            //@ts-ignore
                            userId: this.userId,
                            messageId: data.id,
                            id: attachmentId
                        });
                    });
                    attachments.push({
                        filename: part.filename,
                        mimeType: part.mimeType || '',
                        attachment: attachment.data
                    });
                }
            }
            this.push({
                email: message.data,
                attachments
            });
        }
        catch (err) {
            console.log(err);
            this.destroy(err);
        }
    }
    async getNextMessageIds() {
        let ids = new Array();
        if (this.finished) {
            return ids;
        }
        try {
            let rateLimiter = this.options.rateLimiter;
            // Retrieve a list of message IDs first
            const res = await rateLimiter.async(5, () => this.gmail.users.messages.list({
                pageToken: this.pageToken == null ? undefined : this.pageToken,
                includeSpamTrash: this.options.includeSpamTrash,
                labelIds: this.options.labels,
                q: this.options.query,
                maxResults: this.options.maxResults,
                userId: this.userId
            }));
            this.pageToken = res.data.nextPageToken;
            if (res.data.messages == null) {
                this.finished = true;
                return ids;
            }
            if (this.pageToken == null && res.data.messages.length <= this.options.maxResults) {
                this.finished = true;
            }
            //@ts-ignore
            ids = res.data.messages
                .filter(it => it.id != null)
                .map(it => it.id);
        }
        catch (err) {
            this.destroy(err);
        }
        return ids;
    }
}
exports.GmailReadableStream = GmailReadableStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVhZGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUmVhZGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQTREO0FBRTVELDJDQUE2QztBQWM3QyxNQUFhLG1CQUFvQixTQUFRLDBCQUFRO0lBVTlDLFlBQ0csV0FBbUMsRUFDbkMsVUFBMkMsRUFDM0MsTUFBYyxFQUNkLE9BQXlCO1FBRXpCLEtBQUssQ0FBQztZQUNILEdBQUcsT0FBTztZQUNWLFVBQVUsRUFBRSxJQUFJO1NBQ2xCLENBQUMsQ0FBQTtRQWJHLGNBQVMsR0FBOEIsU0FBUyxDQUFBO1FBZXJELElBQUksQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFBO1FBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFBO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQTtRQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTtRQUVyQixJQUFJLENBQUMsS0FBSyxHQUFHLG1CQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsSUFBSSxFQUFFLFVBQVU7U0FDbEIsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLOztRQUNSLElBQUk7WUFDRCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQTtZQUUxQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFBO1lBRWhDLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO2dCQUNoRCxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtnQkFFNUIsSUFB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QUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO2dCQUM3QixDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO2dCQUNyQixVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVO2dCQUNuQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDckIsQ0FBQyxDQUNKLENBQUE7WUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFBO1lBRXZDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO2dCQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtnQkFDcEIsT0FBTyxHQUFHLENBQUE7YUFDWjtZQUVELElBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO2dCQUMvRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTthQUN0QjtZQUVELFlBQVk7WUFDWixHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRO2lCQUNuQixNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQztpQkFDM0IsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1NBRXRCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQ25CO1FBRUQsT0FBTyxHQUFHLENBQUE7SUFDYixDQUFDO0NBQ0g7QUFySkQsa0RBcUpDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVhZGFibGUsIFJlYWRhYmxlT3B0aW9ucyB9IGZyb20gXCJyZWFkYWJsZS1zdHJlYW1cIjtcbmltcG9ydCB7IEdtYWlsUmVhZFN0cmVhbU9wdGlvbnMgfSBmcm9tIFwiLi9Hb29nbGVTdHJlYW1PcHRpb25zXCI7XG5pbXBvcnQgeyBnb29nbGUsIGdtYWlsX3YxIH0gZnJvbSAnZ29vZ2xlYXBpcydcbmltcG9ydCB7IEdvb2dsZUF1dGgsIEpXVCwgT0F1dGgyQ2xpZW50IH0gZnJvbSAnZ29vZ2xlLWF1dGgtbGlicmFyeSdcblxuZXhwb3J0IHR5cGUgQXR0YWNobWVudCA9IHtcbiAgIGZpbGVuYW1lOiBzdHJpbmdcbiAgIG1pbWVUeXBlOiBzdHJpbmdcbiAgIGF0dGFjaG1lbnQ6IGFueVxufVxuXG5leHBvcnQgdHlwZSBHbWFpbE9iamVjdCA9IHtcbiAgIGVtYWlsOiBhbnlcbiAgIGF0dGFjaG1lbnRzOiBBdHRhY2htZW50W11cbn1cblxuZXhwb3J0IGNsYXNzIEdtYWlsUmVhZGFibGVTdHJlYW0gZXh0ZW5kcyBSZWFkYWJsZSB7XG4gICByZWFkb25seSBvcHRpb25zOiBHbWFpbFJlYWRTdHJlYW1PcHRpb25zXG4gICByZWFkb25seSB1c2VySWQ6IHN0cmluZyAvLyBJbXBlcnNvbmF0aW9uIGVtYWlsXG4gICByZWFkb25seSBhdXRoOiBHb29nbGVBdXRoIHwgSldUIHwgT0F1dGgyQ2xpZW50IHwgc3RyaW5nXG5cbiAgIHByaXZhdGUgZ21haWw6IGdtYWlsX3YxLkdtYWlsXG4gICBwcml2YXRlIHBhZ2VUb2tlbjogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICAgcHJpdmF0ZSBtZXNzYWdlSWRzOiBzdHJpbmdbXVxuICAgcHJpdmF0ZSBmaW5pc2hlZDogYm9vbGVhblxuXG4gICBjb25zdHJ1Y3RvcihcbiAgICAgIHJlYWRPcHRpb25zOiBHbWFpbFJlYWRTdHJlYW1PcHRpb25zLFxuICAgICAgYXV0aENsaWVudDogR29vZ2xlQXV0aCB8IEpXVCB8IE9BdXRoMkNsaWVudCxcbiAgICAgIHVzZXJJZDogc3RyaW5nLFxuICAgICAgb3B0aW9ucz86IFJlYWRhYmxlT3B0aW9uc1xuICAgKSB7XG4gICAgICBzdXBlcih7XG4gICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgb2JqZWN0TW9kZTogdHJ1ZVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vcHRpb25zID0gcmVhZE9wdGlvbnNcbiAgICAgIHRoaXMuYXV0aCA9IGF1dGhDbGllbnRcbiAgICAgIHRoaXMudXNlcklkID0gdXNlcklkXG4gICAgICB0aGlzLm1lc3NhZ2VJZHMgPSBuZXcgQXJyYXk8c3RyaW5nPigpXG4gICAgICB0aGlzLmZpbmlzaGVkID0gZmFsc2VcblxuICAgICAgdGhpcy5nbWFpbCA9IGdvb2dsZS5nbWFpbCh7XG4gICAgICAgICB2ZXJzaW9uOiAndjEnLFxuICAgICAgICAgYXV0aDogYXV0aENsaWVudFxuICAgICAgfSlcbiAgIH1cblxuICAgYXN5bmMgX3JlYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICB0cnkge1xuICAgICAgICAgbGV0IHJhdGVMaW1pdGVyID0gdGhpcy5vcHRpb25zLnJhdGVMaW1pdGVyXG5cbiAgICAgICAgIGxldCBpZCA9IHRoaXMubWVzc2FnZUlkcy5zaGlmdCgpXG5cbiAgICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VJZHMgPSBhd2FpdCB0aGlzLmdldE5leHRNZXNzYWdlSWRzKClcbiAgICAgICAgICAgIGlkID0gdGhpcy5tZXNzYWdlSWRzLnNoaWZ0KClcblxuICAgICAgICAgICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIHRoaXMucHVzaChudWxsKVxuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICAgICBcbiAgICAgICAgIGxldCBtZXNzYWdlID0gYXdhaXQgcmF0ZUxpbWl0ZXIuYXN5bmMoXG4gICAgICAgICAgICA1LFxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmdtYWlsLnVzZXJzLm1lc3NhZ2VzLmdldCh7XG4gICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgICAgaWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICApXG5cbiAgICAgICAgIGxldCBkYXRhID0gbWVzc2FnZS5kYXRhXG4gICAgICAgICBsZXQgYXR0YWNobWVudHMgPSBuZXcgQXJyYXk8QXR0YWNobWVudD4oKVxuXG4gICAgICAgICAvLyBQdWxsIGF0dGFjaG1lbnRzIGlmIG5lZWRlZFxuICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbmNsdWRlQXR0YWNobWVudHMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnQgb2YgZGF0YS5wYXlsb2FkPy5wYXJ0cyB8fCBbXSkge1xuICAgICAgICAgICAgICAgbGV0IGF0dGFjaG1lbnRJZCA9IHBhcnQuYm9keT8uYXR0YWNobWVudElkXG5cbiAgICAgICAgICAgICAgIGlmIChwYXJ0LmZpbGVuYW1lID09IG51bGwgfHwgcGFydC5maWxlbmFtZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgIGlmIChhdHRhY2htZW50SWQgPT09IG51bGwgfHwgYXR0YWNobWVudElkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgIGxldCBhdHRhY2htZW50ID0gYXdhaXQgcmF0ZUxpbWl0ZXIuYXN5bmMoXG4gICAgICAgICAgICAgICAgICA1LFxuICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ21haWwudXNlcnMubWVzc2FnZXMuYXR0YWNobWVudHMuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogZGF0YS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhdHRhY2htZW50SWRcbiAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICApXG5cbiAgICAgICAgICAgICAgIGF0dGFjaG1lbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHBhcnQuZmlsZW5hbWUsXG4gICAgICAgICAgICAgICAgICBtaW1lVHlwZTogcGFydC5taW1lVHlwZSB8fCAnJyxcbiAgICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQ6IGF0dGFjaG1lbnQuZGF0YVxuICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgdGhpcy5wdXNoKHtcbiAgICAgICAgICAgIGVtYWlsOiBtZXNzYWdlLmRhdGEsXG4gICAgICAgICAgICBhdHRhY2htZW50c1xuICAgICAgICAgfSlcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgdGhpcy5kZXN0cm95KGVycilcbiAgICAgIH1cbiAgIH1cblxuICAgcHJpdmF0ZSBhc3luYyBnZXROZXh0TWVzc2FnZUlkcygpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICBsZXQgaWRzID0gbmV3IEFycmF5PHN0cmluZz4oKVxuXG4gICAgICBpZih0aGlzLmZpbmlzaGVkKSB7XG4gICAgICAgICByZXR1cm4gaWRzXG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgICBsZXQgcmF0ZUxpbWl0ZXIgPSB0aGlzLm9wdGlvbnMucmF0ZUxpbWl0ZXJcblxuICAgICAgICAgLy8gUmV0cmlldmUgYSBsaXN0IG9mIG1lc3NhZ2UgSURzIGZpcnN0XG4gICAgICAgICBjb25zdCByZXMgPSBhd2FpdCByYXRlTGltaXRlci5hc3luYyhcbiAgICAgICAgICAgIDUsXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmdtYWlsLnVzZXJzLm1lc3NhZ2VzLmxpc3Qoe1xuICAgICAgICAgICAgICAgcGFnZVRva2VuOiB0aGlzLnBhZ2VUb2tlbiA9PSBudWxsID8gdW5kZWZpbmVkIDogdGhpcy5wYWdlVG9rZW4sXG4gICAgICAgICAgICAgICBpbmNsdWRlU3BhbVRyYXNoOiB0aGlzLm9wdGlvbnMuaW5jbHVkZVNwYW1UcmFzaCxcbiAgICAgICAgICAgICAgIGxhYmVsSWRzOiB0aGlzLm9wdGlvbnMubGFiZWxzLFxuICAgICAgICAgICAgICAgcTogdGhpcy5vcHRpb25zLnF1ZXJ5LFxuICAgICAgICAgICAgICAgbWF4UmVzdWx0czogdGhpcy5vcHRpb25zLm1heFJlc3VsdHMsXG4gICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMudXNlcklkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgKVxuXG4gICAgICAgICB0aGlzLnBhZ2VUb2tlbiA9IHJlcy5kYXRhLm5leHRQYWdlVG9rZW5cblxuICAgICAgICAgaWYgKHJlcy5kYXRhLm1lc3NhZ2VzID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoZWQgPSB0cnVlXG4gICAgICAgICAgICByZXR1cm4gaWRzXG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmKHRoaXMucGFnZVRva2VuID09IG51bGwgJiYgcmVzLmRhdGEubWVzc2FnZXMubGVuZ3RoIDw9IHRoaXMub3B0aW9ucy5tYXhSZXN1bHRzKSB7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaGVkID0gdHJ1ZVxuICAgICAgICAgfVxuXG4gICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgIGlkcyA9IHJlcy5kYXRhLm1lc3NhZ2VzXG4gICAgICAgICAgICAuZmlsdGVyKGl0ID0+IGl0LmlkICE9IG51bGwpXG4gICAgICAgICAgICAubWFwKGl0ID0+IGl0LmlkKVxuXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgIHRoaXMuZGVzdHJveShlcnIpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpZHNcbiAgIH1cbn0iXX0=