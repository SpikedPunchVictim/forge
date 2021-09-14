"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoOpReadStream = void 0;
const readable_stream_1 = require("readable-stream");
class NoOpReadStream extends readable_stream_1.Readable {
    constructor() {
        super();
    }
    _read() {
    }
}
exports.NoOpReadStream = NoOpReadStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9PcFN0cmVhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJlYW1zL05vT3BTdHJlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQTBDO0FBRTFDLE1BQWEsY0FBZSxTQUFRLDBCQUFRO0lBQ3pDO1FBQ0csS0FBSyxFQUFFLENBQUE7SUFDVixDQUFDO0lBRUQsS0FBSztJQUNMLENBQUM7Q0FDSDtBQVBELHdDQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVhZGFibGUgfSBmcm9tICdyZWFkYWJsZS1zdHJlYW0nXG5cbmV4cG9ydCBjbGFzcyBOb09wUmVhZFN0cmVhbSBleHRlbmRzIFJlYWRhYmxlIHtcbiAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKVxuICAgfVxuXG4gICBfcmVhZCgpIHtcbiAgIH1cbn0iXX0=