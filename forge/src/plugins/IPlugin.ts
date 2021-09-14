import { Readable, Transform, Writable } from 'readable-stream'
import { IBuildState } from '../core/BuildState'
import { IStep } from '../core/Step'

export interface IPlugin {
   readonly name: string
   read(state: IBuildState, step: IStep): Promise<Readable>
   write(state: IBuildState, step: IStep): Promise<Writable>
   transform(state: IBuildState, step: IStep): Promise<Transform>
}

/**
 * Determines if an object is an IPlugin
 * 
 * @param obj The object to test
 */
export function isPlugin(obj: any): obj is IPlugin {
   return ('name' in obj)
}