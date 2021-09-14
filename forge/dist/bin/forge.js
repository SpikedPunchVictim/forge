#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
   TODO:
      - Add support for custom env variables in the forge file (ie ${customVariable}) that can be set from the command line/options

*/
//const program = require('commander')
const commander_1 = require("commander");
const index_1 = require("../index");
const path = require('path');
const fs = require('fs-extra');
const resolve = require('resolve-dir');
const pkg = require(path.join(__dirname, '..', '..', 'package.json'));
commander_1.program
    .version(pkg.version)
    .option('-f, --file <path>', 'The forge project file', normalizePath, './forge.js')
    .option('--cwd <path>', 'The current working directory for the forge file', normalizePath, './forge.js')
    .option('-r, --record-file <record file path>', 'If set, will export the resulting build record as a JSON file', normalizePath, null)
    .action(async (args) => {
    try {
        let record = await index_1.build(args.file, {
            cwd: args.cwd || process.cwd
        });
        if (args.recordFile) {
            await writeBuildState(record, args.recordFile);
        }
        process.exit(0);
    }
    catch (err) {
        console.error(`Failed to perform the forge build. Reason:\n`);
        printError(err);
        process.exit(1);
    }
});
commander_1.program.parse(process.argv);
/*------------------------------------------------------------------------
 * Writes out the BuildRecord to disk
 * @param record The BuildRecord
 * @param outPath The absolute path to the BuildRecord file
 *----------------------------------------------------------------------*/
async function writeBuildState(record, outPath) {
    let outDir = path.dirname(outPath);
    await fs.ensureDir(outDir);
    await fs.writeJson(outPath, record, { spaces: 2 });
}
/*------------------------------------------------------------------------
 * Resolves a path to an absolute path.

 * @param filePath A relative or absolute file path
 *----------------------------------------------------------------------*/
function normalizePath(filePath) {
    if (filePath.charAt(0) === '.') {
        return path.resolve(filePath);
    }
    return resolve(filePath);
}
/*------------------------------------------------------------------------
 * Formats an Error into a readable string with stack trace and message
 *
 * @param {Error} err The Error to format
 *----------------------------------------------------------------------*/
function formatError(err) {
    let result = `${err}`;
    if (err.stack) {
        result += '\n\n--------------------------------------------------------\n';
        if (err.message) {
            result += `:: Message:\n${err.message}\n`;
        }
        result += `\n:: Stack\n${err.stack}`;
        result += '\n--------------------------------------------------------\n';
    }
    return result;
}
/*------------------------------------------------------------------------
 * Prints an Error object
 *
 * @param {Error} err
 *----------------------------------------------------------------------*/
function printError(err) {
    console.log(formatError(err));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmluL2ZvcmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBOzs7O0VBSUU7QUFDRixzQ0FBc0M7QUFDdEMseUNBQW1DO0FBQ25DLG9DQUE2QztBQUM3QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDNUIsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzlCLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUV0QyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFBO0FBRXJFLG1CQUFPO0tBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7S0FDcEIsTUFBTSxDQUFDLG1CQUFtQixFQUFFLHdCQUF3QixFQUFFLGFBQWEsRUFBRSxZQUFZLENBQUM7S0FDbEYsTUFBTSxDQUFDLGNBQWMsRUFBRSxrREFBa0QsRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDO0tBQ3ZHLE1BQU0sQ0FBQyxzQ0FBc0MsRUFBRSwrREFBK0QsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDO0tBQ3BJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDcEIsSUFBSTtRQUNELElBQUksTUFBTSxHQUFHLE1BQU0sYUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDakMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUc7U0FDOUIsQ0FBQyxDQUFBO1FBRUYsSUFBRyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLE1BQU0sZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7U0FDaEQ7UUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ2pCO0lBQUMsT0FBTSxHQUFHLEVBQUU7UUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUE7UUFDN0QsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNqQjtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUwsbUJBQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBRzNCOzs7OzBFQUkwRTtBQUMxRSxLQUFLLFVBQVUsZUFBZSxDQUFDLE1BQW1CLEVBQUUsT0FBZTtJQUNoRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2xDLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUMxQixNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3JELENBQUM7QUFFRDs7OzswRUFJMEU7QUFDMUUsU0FBUyxhQUFhLENBQUMsUUFBUTtJQUM1QixJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1FBQzdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUMvQjtJQUVELE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzNCLENBQUM7QUFFRDs7OzswRUFJMEU7QUFDMUUsU0FBUyxXQUFXLENBQUMsR0FBRztJQUNyQixJQUFJLE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFBO0lBRXJCLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtRQUNaLE1BQU0sSUFBSSxnRUFBZ0UsQ0FBQTtRQUUxRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7WUFDZCxNQUFNLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxPQUFPLElBQUksQ0FBQTtTQUMzQztRQUVELE1BQU0sSUFBSSxlQUFlLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUNwQyxNQUFNLElBQUksOERBQThELENBQUE7S0FDMUU7SUFFRCxPQUFPLE1BQU0sQ0FBQTtBQUNoQixDQUFDO0FBRUQ7Ozs7MEVBSTBFO0FBQzFFLFNBQVMsVUFBVSxDQUFDLEdBQUc7SUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUNoQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG4vKlxuICAgVE9ETzpcbiAgICAgIC0gQWRkIHN1cHBvcnQgZm9yIGN1c3RvbSBlbnYgdmFyaWFibGVzIGluIHRoZSBmb3JnZSBmaWxlIChpZSAke2N1c3RvbVZhcmlhYmxlfSkgdGhhdCBjYW4gYmUgc2V0IGZyb20gdGhlIGNvbW1hbmQgbGluZS9vcHRpb25zXG5cbiovXG4vL2NvbnN0IHByb2dyYW0gPSByZXF1aXJlKCdjb21tYW5kZXInKVxuaW1wb3J0IHsgcHJvZ3JhbSB9IGZyb20gJ2NvbW1hbmRlcidcbmltcG9ydCB7IGJ1aWxkLCBCdWlsZFJlY29yZCB9IGZyb20gJy4uL2luZGV4J1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcy1leHRyYScpXG5jb25zdCByZXNvbHZlID0gcmVxdWlyZSgncmVzb2x2ZS1kaXInKVxuXG5jb25zdCBwa2cgPSByZXF1aXJlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICdwYWNrYWdlLmpzb24nKSlcblxucHJvZ3JhbVxuICAgLnZlcnNpb24ocGtnLnZlcnNpb24pXG4gICAub3B0aW9uKCctZiwgLS1maWxlIDxwYXRoPicsICdUaGUgZm9yZ2UgcHJvamVjdCBmaWxlJywgbm9ybWFsaXplUGF0aCwgJy4vZm9yZ2UuanMnKVxuICAgLm9wdGlvbignLS1jd2QgPHBhdGg+JywgJ1RoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5IGZvciB0aGUgZm9yZ2UgZmlsZScsIG5vcm1hbGl6ZVBhdGgsICcuL2ZvcmdlLmpzJylcbiAgIC5vcHRpb24oJy1yLCAtLXJlY29yZC1maWxlIDxyZWNvcmQgZmlsZSBwYXRoPicsICdJZiBzZXQsIHdpbGwgZXhwb3J0IHRoZSByZXN1bHRpbmcgYnVpbGQgcmVjb3JkIGFzIGEgSlNPTiBmaWxlJywgbm9ybWFsaXplUGF0aCwgbnVsbClcbiAgIC5hY3Rpb24oYXN5bmMgKGFyZ3MpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgICBsZXQgcmVjb3JkID0gYXdhaXQgYnVpbGQoYXJncy5maWxlLCB7XG4gICAgICAgICAgICBjd2Q6IGFyZ3MuY3dkIHx8IHByb2Nlc3MuY3dkXG4gICAgICAgICB9KVxuXG4gICAgICAgICBpZihhcmdzLnJlY29yZEZpbGUpIHtcbiAgICAgICAgICAgIGF3YWl0IHdyaXRlQnVpbGRTdGF0ZShyZWNvcmQsIGFyZ3MucmVjb3JkRmlsZSlcbiAgICAgICAgIH1cbiAgIFxuICAgICAgICAgcHJvY2Vzcy5leGl0KDApXG4gICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHBlcmZvcm0gdGhlIGZvcmdlIGJ1aWxkLiBSZWFzb246XFxuYClcbiAgICAgICAgIHByaW50RXJyb3IoZXJyKVxuICAgICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICB9XG4gICB9KVxuICAgXG5wcm9ncmFtLnBhcnNlKHByb2Nlc3MuYXJndilcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogV3JpdGVzIG91dCB0aGUgQnVpbGRSZWNvcmQgdG8gZGlza1xuICogQHBhcmFtIHJlY29yZCBUaGUgQnVpbGRSZWNvcmRcbiAqIEBwYXJhbSBvdXRQYXRoIFRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBCdWlsZFJlY29yZCBmaWxlXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuYXN5bmMgZnVuY3Rpb24gd3JpdGVCdWlsZFN0YXRlKHJlY29yZDogQnVpbGRSZWNvcmQsIG91dFBhdGg6IHN0cmluZykge1xuICAgbGV0IG91dERpciA9IHBhdGguZGlybmFtZShvdXRQYXRoKVxuICAgYXdhaXQgZnMuZW5zdXJlRGlyKG91dERpcilcbiAgIGF3YWl0IGZzLndyaXRlSnNvbihvdXRQYXRoLCByZWNvcmQsIHsgc3BhY2VzOiAyIH0pXG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBSZXNvbHZlcyBhIHBhdGggdG8gYW4gYWJzb2x1dGUgcGF0aC5cblxuICogQHBhcmFtIGZpbGVQYXRoIEEgcmVsYXRpdmUgb3IgYWJzb2x1dGUgZmlsZSBwYXRoXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZnVuY3Rpb24gbm9ybWFsaXplUGF0aChmaWxlUGF0aCkge1xuICAgaWYgKGZpbGVQYXRoLmNoYXJBdCgwKSA9PT0gJy4nKSB7XG4gICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKGZpbGVQYXRoKVxuICAgfVxuXG4gICByZXR1cm4gcmVzb2x2ZShmaWxlUGF0aClcbn1cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEZvcm1hdHMgYW4gRXJyb3IgaW50byBhIHJlYWRhYmxlIHN0cmluZyB3aXRoIHN0YWNrIHRyYWNlIGFuZCBtZXNzYWdlXG4gKiBcbiAqIEBwYXJhbSB7RXJyb3J9IGVyciBUaGUgRXJyb3IgdG8gZm9ybWF0XG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZnVuY3Rpb24gZm9ybWF0RXJyb3IoZXJyKSB7XG4gICBsZXQgcmVzdWx0ID0gYCR7ZXJyfWBcblxuICAgaWYgKGVyci5zdGFjaykge1xuICAgICAgcmVzdWx0ICs9ICdcXG5cXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcbidcblxuICAgICAgaWYgKGVyci5tZXNzYWdlKSB7XG4gICAgICAgICByZXN1bHQgKz0gYDo6IE1lc3NhZ2U6XFxuJHtlcnIubWVzc2FnZX1cXG5gXG4gICAgICB9XG5cbiAgICAgIHJlc3VsdCArPSBgXFxuOjogU3RhY2tcXG4ke2Vyci5zdGFja31gXG4gICAgICByZXN1bHQgKz0gJ1xcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuJ1xuICAgfVxuXG4gICByZXR1cm4gcmVzdWx0XG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBQcmludHMgYW4gRXJyb3Igb2JqZWN0XG4gKiBcbiAqIEBwYXJhbSB7RXJyb3J9IGVyciBcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5mdW5jdGlvbiBwcmludEVycm9yKGVycikge1xuICAgY29uc29sZS5sb2coZm9ybWF0RXJyb3IoZXJyKSlcbn0iXX0=