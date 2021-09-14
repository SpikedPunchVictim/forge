"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StepOptions = void 0;
class S3StepOptions {
    constructor() {
        this.bucket = '';
        this.key = '';
    }
    static fromStep(info, options) {
        let stepOptions = new S3StepOptions();
        let either = (key) => {
            if (info[key] == null && options[key] == null) {
                throw new Error(`No '${key}' has been provided. '${key}' must be provided in the S3Plugin constructor or in the Step configuration.`);
            }
            stepOptions[key] = info[key] || options[key];
        };
        let step = (key) => {
            if (info[key] == null) {
                throw new Error(`No '${key}' has been provided. '${key}' must be provided in the Step configuration.`);
            }
            stepOptions[key] = info[key];
        };
        // Validate
        either('bucket');
        step('key');
        either('accessKeyId');
        either('secretAccessKey');
        either('region');
        stepOptions.s3Options = info.s3Options || undefined;
        return stepOptions;
    }
}
exports.S3StepOptions = S3StepOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUzNTdGVwT3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9TM1N0ZXBPcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLE1BQWEsYUFBYTtJQUExQjtRQUNHLFdBQU0sR0FBVyxFQUFFLENBQUE7UUFDbkIsUUFBRyxHQUFXLEVBQUUsQ0FBQTtJQW9DbkIsQ0FBQztJQTlCRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQWMsRUFBRSxPQUF3QjtRQUNyRCxJQUFJLFdBQVcsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFBO1FBRXJDLElBQUksTUFBTSxHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUU7WUFDMUIsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUU7Z0JBQzNDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLHlCQUF5QixHQUFHLDhFQUE4RSxDQUFDLENBQUE7YUFDdkk7WUFFRCxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUMvQyxDQUFDLENBQUE7UUFFRCxJQUFJLElBQUksR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO1lBQ3hCLElBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRTtnQkFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcseUJBQXlCLEdBQUcsK0NBQStDLENBQUMsQ0FBQTthQUN4RztZQUVELFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDL0IsQ0FBQyxDQUFBO1FBRUQsV0FBVztRQUNYLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDWCxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDckIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUE7UUFDekIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRWhCLFdBQVcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUE7UUFFbkQsT0FBTyxXQUFXLENBQUE7SUFDckIsQ0FBQztDQUNIO0FBdENELHNDQXNDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFMzIH0gZnJvbSAnYXdzLXNkaydcbmltcG9ydCB7IFN0ZXBJbmZvIH0gZnJvbSAnQHNwaWtlZHB1bmNoL2ZvcmdlJ1xuaW1wb3J0IHsgUzNQbHVnaW5PcHRpb25zIH0gZnJvbSAnLi9QbHVnaW4nXG5cbmV4cG9ydCBjbGFzcyBTM1N0ZXBPcHRpb25zIHtcbiAgIGJ1Y2tldDogc3RyaW5nID0gJydcbiAgIGtleTogc3RyaW5nID0gJydcbiAgIGFjY2Vzc0tleUlkPzogc3RyaW5nXG4gICBzZWNyZXRBY2Nlc3NLZXk/OiBzdHJpbmdcbiAgIHJlZ2lvbj86IHN0cmluZ1xuICAgczNPcHRpb25zPzogUzMuQ2xpZW50Q29uZmlndXJhdGlvblxuXG4gICBzdGF0aWMgZnJvbVN0ZXAoaW5mbzogU3RlcEluZm8sIG9wdGlvbnM6IFMzUGx1Z2luT3B0aW9ucyk6IFMzU3RlcE9wdGlvbnMge1xuICAgICAgbGV0IHN0ZXBPcHRpb25zID0gbmV3IFMzU3RlcE9wdGlvbnMoKVxuXG4gICAgICBsZXQgZWl0aGVyID0gKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICBpZihpbmZvW2tleV0gPT0gbnVsbCAmJiBvcHRpb25zW2tleV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyAnJHtrZXl9JyBoYXMgYmVlbiBwcm92aWRlZC4gJyR7a2V5fScgbXVzdCBiZSBwcm92aWRlZCBpbiB0aGUgUzNQbHVnaW4gY29uc3RydWN0b3Igb3IgaW4gdGhlIFN0ZXAgY29uZmlndXJhdGlvbi5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBzdGVwT3B0aW9uc1trZXldID0gaW5mb1trZXldIHx8IG9wdGlvbnNba2V5XVxuICAgICAgfVxuXG4gICAgICBsZXQgc3RlcCA9IChrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgaWYoaW5mb1trZXldID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gJyR7a2V5fScgaGFzIGJlZW4gcHJvdmlkZWQuICcke2tleX0nIG11c3QgYmUgcHJvdmlkZWQgaW4gdGhlIFN0ZXAgY29uZmlndXJhdGlvbi5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBzdGVwT3B0aW9uc1trZXldID0gaW5mb1trZXldXG4gICAgICB9XG5cbiAgICAgIC8vIFZhbGlkYXRlXG4gICAgICBlaXRoZXIoJ2J1Y2tldCcpXG4gICAgICBzdGVwKCdrZXknKVxuICAgICAgZWl0aGVyKCdhY2Nlc3NLZXlJZCcpXG4gICAgICBlaXRoZXIoJ3NlY3JldEFjY2Vzc0tleScpXG4gICAgICBlaXRoZXIoJ3JlZ2lvbicpXG5cbiAgICAgIHN0ZXBPcHRpb25zLnMzT3B0aW9ucyA9IGluZm8uczNPcHRpb25zIHx8IHVuZGVmaW5lZFxuICBcbiAgICAgIHJldHVybiBzdGVwT3B0aW9uc1xuICAgfVxufSJdfQ==