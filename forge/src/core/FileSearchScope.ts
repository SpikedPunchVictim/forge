const path = require('path')
import * as fs from 'fs-extra'
const globby = require('globby')

/**
 * Contains the logic to resolve file paths
 */
export class FileSearchScope {
   readonly dirs: Array<string>
   private _merged: Array<FileSearchScope>

   constructor(dirs: Array<string> = new Array<string>()) {
      this.dirs = dirs
      this._merged = []
   }

   /*---------------------------------------------------------------------
    * Searches for the existence of a file at the provided relative path
    *
    * @param {string} relativePath The relative path to search for
    * @returns string The absolute path of the first file found
    *-------------------------------------------------------------------*/
   async find(relativePath: string): Promise<string | undefined> {
      for (let dir of this.dirs) {
         let filePath = path.join(dir, relativePath)
         let stat: fs.Stats | undefined = undefined

         try {
            stat = await fs.stat(filePath)
         } catch (ex) {
            continue
         }

         if(stat == null) {
            continue
         }

         if (stat.isFile()) {
            return filePath
         }
      }

      for (let scope of this._merged) {
         let found = await scope.find(relativePath)

         if (found !== undefined) {
            return found
         }
      }

      return undefined
   }

   /**
    * Searches for files matching a globbed pattern. A non-globbed
    * file path can also be used.
    * 
    * @param relativeGlobPath A relative path that may or may not contain a globbed pattern
    * @param defaultResult Default value should a value not be found
    */
   async findGlob(relativeGlobPath: string, defaultResult: string[] = new Array<string>()): Promise<string[]> {
      if (globby.hasMagic(relativeGlobPath)) {
         for (let dir of this.dirs) {
            let globbed = await globby(path.join(dir, relativeGlobPath))

            if (globbed.length > 0) {
               return globbed
            }
         }
      } else {
         let found = await this.find(relativeGlobPath)

         if(found) {
            return [found]
         }
      }

      return defaultResult
   }

   /*---------------------------------------------------------------------
    * Adds a directory to the search scope
    *
    * @param {Array | string} dir Directory(ies) to add to the search scope
    *-------------------------------------------------------------------*/
   add(dir: string | Array<string>): void {
      let addOne = p => {
         let found = this.dirs.indexOf(p)

         if (found < 0) {
            this.dirs.push(p)
         }
      }

      if (typeof dir === 'string') {
         addOne(dir)
      } else if (Array.isArray(dir)) {
         dir.forEach(d => addOne(d))
      }
   }

   /*---------------------------------------------------------------------
    * Merges another FileResolver with this one. It will be used
    * when finding files
    *
    * @param {FileResolver} fileResolver 
    *-------------------------------------------------------------------*/
   merge(scope: FileSearchScope): void {
      if (this._merged.indexOf(scope) >= 0) {
         return
      }

      this._merged.push(scope)
   }
}