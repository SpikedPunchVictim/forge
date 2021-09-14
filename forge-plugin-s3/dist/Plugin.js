"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Plugin = exports.S3Envoy = void 0;
const aws_sdk_1 = require("aws-sdk");
const S3StepOptions_1 = require("./S3StepOptions");
const Writable_1 = require("./Writable");
class S3Envoy {
    constructor() {
    }
}
exports.S3Envoy = S3Envoy;
class S3Plugin {
    constructor(options) {
        this.name = 'forge-plugin-s3';
        this.options = options || {};
        // Global aws-sdk config
        aws_sdk_1.config.apiVersions = {
            s3: '2006-03-01',
        };
    }
    // async createEnvoy(state: IBuildState, info: StepInfo): Promise<IEnvoy> {
    //    throw new Error('hh')
    // }
    async read(state, step) {
        let options = S3StepOptions_1.S3StepOptions.fromStep(step.info, this.options);
        let s3 = new aws_sdk_1.S3({
            credentials: new aws_sdk_1.Credentials({
                accessKeyId: this.options.accessKeyId || '',
                secretAccessKey: this.options.secretAccessKey || '',
                ...(options.s3Options || {})
            })
        });
        return s3
            .getObject({
            Bucket: options.bucket,
            Key: options.key
        }).createReadStream();
    }
    async write(state, step) {
        let options = S3StepOptions_1.S3StepOptions.fromStep(step.info, this.options);
        return new Writable_1.S3WritableStream(options);
    }
    transform(state, step) {
        throw new Error(`Method not implemented. alias: ${step.alias}`);
    }
}
exports.S3Plugin = S3Plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQSxxQ0FBaUQ7QUFDakQsbURBQStDO0FBQy9DLHlDQUE2QztBQUU3QyxNQUFhLE9BQU87SUFJakI7SUFFQSxDQUFDO0NBQ0g7QUFQRCwwQkFPQztBQVVELE1BQWEsUUFBUTtJQUlsQixZQUFZLE9BQXlCO1FBSDVCLFNBQUksR0FBVyxpQkFBaUIsQ0FBQTtRQUl0QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUE7UUFFNUIsd0JBQXdCO1FBQ3hCLGdCQUFNLENBQUMsV0FBVyxHQUFHO1lBQ2xCLEVBQUUsRUFBRSxZQUFZO1NBQ2pCLENBQUE7SUFDTCxDQUFDO0lBRUQsMkVBQTJFO0lBQzNFLDJCQUEyQjtJQUMzQixJQUFJO0lBRUosS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFrQixFQUFFLElBQVc7UUFDdkMsSUFBSSxPQUFPLEdBQUcsNkJBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFN0QsSUFBSSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUM7WUFDYixXQUFXLEVBQUUsSUFBSSxxQkFBVyxDQUFDO2dCQUMxQixXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksRUFBRTtnQkFDM0MsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxJQUFJLEVBQUU7Z0JBQ25ELEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQzthQUM5QixDQUFDO1NBQ0osQ0FBQyxDQUFBO1FBRUYsT0FBTyxFQUFFO2FBQ0wsU0FBUyxDQUFDO1lBQ1IsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1lBQ3RCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRztTQUNsQixDQUFDLENBQUMsZ0JBQWdCLEVBQWMsQ0FBQTtJQUN2QyxDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFrQixFQUFFLElBQVc7UUFDeEMsSUFBSSxPQUFPLEdBQUcsNkJBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDN0QsT0FBTyxJQUFJLDJCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3ZDLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBa0IsRUFBRSxJQUFXO1FBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQ2xFLENBQUM7Q0FDSDtBQTNDRCw0QkEyQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgSUJ1aWxkU3RhdGUsXG4gICBJRW52b3ksXG4gICBJUGx1Z2luLFxuICAgSVN0ZXAgfSBmcm9tICdAc3Bpa2VkcHVuY2gvZm9yZ2UnXG5cbmltcG9ydCB7IFJlYWRhYmxlLCBXcml0YWJsZSwgVHJhbnNmb3JtIH0gZnJvbSAncmVhZGFibGUtc3RyZWFtJ1xuaW1wb3J0IHsgY29uZmlnLCBDcmVkZW50aWFscywgUzMgfSBmcm9tICdhd3Mtc2RrJ1xuaW1wb3J0IHsgUzNTdGVwT3B0aW9ucyB9IGZyb20gJy4vUzNTdGVwT3B0aW9ucydcbmltcG9ydCB7IFMzV3JpdGFibGVTdHJlYW0gfSBmcm9tICcuL1dyaXRhYmxlJ1xuXG5leHBvcnQgY2xhc3MgUzNFbnZveSBpbXBsZW1lbnRzIElFbnZveSB7XG4gICBkYXRhOiBhbnlcbiAgIG1ldGFkYXRhOiBhbnlcblxuICAgY29uc3RydWN0b3IoKSB7XG5cbiAgIH1cbn1cblxuZXhwb3J0IHR5cGUgUzNQbHVnaW5PcHRpb25zID0ge1xuICAgYWNjZXNzS2V5SWQ/OiBzdHJpbmdcbiAgIHNlY3JldEFjY2Vzc0tleT86IHN0cmluZ1xuICAgcmVnaW9uPzogc3RyaW5nXG4gICBidWNrZXQ/OiBzdHJpbmdcbiAgIHMzT3B0aW9ucz86IFMzLkNsaWVudENvbmZpZ3VyYXRpb25cbn1cblxuZXhwb3J0IGNsYXNzIFMzUGx1Z2luIGltcGxlbWVudHMgSVBsdWdpbiB7XG4gICByZWFkb25seSBuYW1lOiBzdHJpbmcgPSAnZm9yZ2UtcGx1Z2luLXMzJ1xuICAgcmVhZG9ubHkgb3B0aW9uczogUzNQbHVnaW5PcHRpb25zXG5cbiAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBTM1BsdWdpbk9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblxuICAgICAgLy8gR2xvYmFsIGF3cy1zZGsgY29uZmlnXG4gICAgICBjb25maWcuYXBpVmVyc2lvbnMgPSB7XG4gICAgICAgICBzMzogJzIwMDYtMDMtMDEnLFxuICAgICAgIH1cbiAgIH1cblxuICAgLy8gYXN5bmMgY3JlYXRlRW52b3koc3RhdGU6IElCdWlsZFN0YXRlLCBpbmZvOiBTdGVwSW5mbyk6IFByb21pc2U8SUVudm95PiB7XG4gICAvLyAgICB0aHJvdyBuZXcgRXJyb3IoJ2hoJylcbiAgIC8vIH1cblxuICAgYXN5bmMgcmVhZChzdGF0ZTogSUJ1aWxkU3RhdGUsIHN0ZXA6IElTdGVwKTogUHJvbWlzZTxSZWFkYWJsZT4ge1xuICAgICAgbGV0IG9wdGlvbnMgPSBTM1N0ZXBPcHRpb25zLmZyb21TdGVwKHN0ZXAuaW5mbywgdGhpcy5vcHRpb25zKVxuXG4gICAgICBsZXQgczMgPSBuZXcgUzMoe1xuICAgICAgICAgY3JlZGVudGlhbHM6IG5ldyBDcmVkZW50aWFscyh7XG4gICAgICAgICAgICBhY2Nlc3NLZXlJZDogdGhpcy5vcHRpb25zLmFjY2Vzc0tleUlkIHx8ICcnLFxuICAgICAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiB0aGlzLm9wdGlvbnMuc2VjcmV0QWNjZXNzS2V5IHx8ICcnLFxuICAgICAgICAgICAgLi4uKG9wdGlvbnMuczNPcHRpb25zIHx8IHt9KVxuICAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiBzM1xuICAgICAgICAgLmdldE9iamVjdCh7XG4gICAgICAgICAgICBCdWNrZXQ6IG9wdGlvbnMuYnVja2V0LFxuICAgICAgICAgICAgS2V5OiBvcHRpb25zLmtleVxuICAgICAgICAgfSkuY3JlYXRlUmVhZFN0cmVhbSgpIGFzIFJlYWRhYmxlXG4gICB9XG5cbiAgIGFzeW5jIHdyaXRlKHN0YXRlOiBJQnVpbGRTdGF0ZSwgc3RlcDogSVN0ZXApOiBQcm9taXNlPFdyaXRhYmxlPiB7XG4gICAgICBsZXQgb3B0aW9ucyA9IFMzU3RlcE9wdGlvbnMuZnJvbVN0ZXAoc3RlcC5pbmZvLCB0aGlzLm9wdGlvbnMpXG4gICAgICByZXR1cm4gbmV3IFMzV3JpdGFibGVTdHJlYW0ob3B0aW9ucylcbiAgIH1cblxuICAgdHJhbnNmb3JtKHN0YXRlOiBJQnVpbGRTdGF0ZSwgc3RlcDogSVN0ZXApOiBQcm9taXNlPFRyYW5zZm9ybT4ge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNZXRob2Qgbm90IGltcGxlbWVudGVkLiBhbGlhczogJHtzdGVwLmFsaWFzfWApXG4gICB9XG59Il19