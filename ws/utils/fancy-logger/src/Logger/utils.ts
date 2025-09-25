import type {ChalkInstance} from 'chalk';
import nodePath from 'node:path';
import { parse as parseStackTrace, type StackFrame } from 'stacktrace-parser';
import type { Logger } from '../Logger';
import type { LogLevelType } from '../types';

export const noopChalk: ChalkInstance = new Proxy(() => '', {
  get: (target, prop) => {
    if (typeof prop === 'string')
      return (...args: any[]) => String(args.join(' '));
    return Reflect.get(target, prop);
  },

  apply: (_target, _thisArg, argArray) => { return String(argArray.join(' ')); },
}) as ChalkInstance;


function prettifyStackFrame(logger:Logger, caller: StackFrame){
  const fileName = caller.file ? nodePath.relative(process.cwd(), caller.file) : '---';
  return [
    "\n\t",
    logger.style.yellow('at'),
    logger.style.gray(`${fileName}`),
    logger.style.magenta(`(${caller.lineNumber}:${caller.column})`),
    logger.style.green( caller.methodName )
    //"\n"
  ];
}

export function getStackFrames(depth:number = 0): StackFrame[]{
  return parseStackTrace(new Error().stack || '').slice(2 + depth);
}

export function getStackExpressions(depth: number = 0): string[]{
  return getStackFrames(depth + 1).map(f => {
    const fileName = f.file ? nodePath.relative(process.cwd(), f.file) : '---';
    return `${fileName} (${f.lineNumber}:${f.column}) ${f.methodName}`;
  });
}

export function log(logger:Logger, kind:string, level:LogLevelType,  method:string, color:string,args:any[]){
  const consoleMethod = (console      as any)[method]as Function;
  const colorFn       = (logger.style as any)[color] as Function;
  if(logger.isActive(level)){
    const stack:string[] = (()=>{
      if( !(logger.isActiveLevel('debug') || logger.config.showCaller ) ) return [];
      const stack  = getStackFrames();
      if(!(level === 'debug' && logger.config.withTrace)) return prettifyStackFrame(logger, stack[0] as StackFrame);
      return stack.map((sf:StackFrame) => prettifyStackFrame(logger,sf)).flat();
    })();
    consoleMethod.apply(console, [
      colorFn(`[${kind}]`), ... logger.tags.map(s => logger.style.cyan(s)),
      ... args, ... stack]);
  }
}
