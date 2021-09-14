const util = require('util')
import { ConsoleLogger } from './Logger'

const logger = new ConsoleLogger()

export interface IElapsedToken {
   key: [number, number]
   seconds: number
   ms: number
   totalMs: number
}

/*------------------------------------------------------------------------
* Records the amount of time that has passed between calls. To use,
* call this method without any parameters, and record the key that
* is returned. At a later time, call this method again with the key
* that was returned previously, and a time span object will be returned.
*
* Example:
*  let key = elapsedTime();
*  ...
*  let span = elapsedTime(key);
*
* @param {string} key If not provided, will return a key.
* @return {IElapsedToken} If called with no parameters, a token
*     is returned, otherwise an time span object is returned
*     with the following properties:
*        {uint} s: seconds (the second portion only)
*        {uint} ms: milliseconds (the ms portion only)
*        {uint} totalMs: The total amount of time in milliseconds                 
/*------------------------------------------------------------------------*/
export function elapsedTime(token?: IElapsedToken): IElapsedToken {
   if (token) {
      let result = process.hrtime(token.key)
      let seconds: number = result[0]
      let ms: number = result[1] / 1000000
      return {
         key: token.key,
         seconds: seconds,
         ms: ms,
         totalMs: (seconds * 1000) + ms
      } as IElapsedToken
   } else {
      return {
         key: process.hrtime(),
         seconds: -1,
         ms: -1,
         totalMs: -1
      } as IElapsedToken
   }
}

/*-----------------------------------------------------------------------*
* Dump an object to stdout. This will display a name for each section
* with each object dump.
*
* @params {string} name The name of the section
* @params {Object} obj The object to dump
* @params {object} options
*        {boolean} alone If set, will remove all other stdout and only display the object
*        {boolean} showColors (default true) If set will add color to the printed results
/*------------------------------------------------------------------------*/
export function inspect(name, obj, options) {
   let opts = options || {};
   opts.alone = opts.alone || false;
   opts.showColors = opts.showColors || true;

   if (opts.alone) {
      process.stdout.write("\x1B[2J");
   }

   if (typeof name === 'object') {
      obj = name;
      name = "Inspect"
   }

   logger.info('----------------------------------------------------');
   logger.info(':: ' + name);
   logger.info(util.inspect(obj, { showHidden: true, depth: null, colors: opts.showColors }));
   logger.info('----------------------------------------------------\n');
}

// export default {
//    inspect,
//    elapsedTime
// }