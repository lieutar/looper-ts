import { log, noopChalk, getStackFrames, getStackExpressions } from "./Logger/utils";
import type { LoggerConfigType, LogLevelType } from "./types";

export { getStackFrames, getStackExpressions };

export class Logger{
  readonly config: Readonly<LoggerConfigType>;
  readonly tags: Readonly<string[]>;
  get style(){ return this.config.style; }

  static numifyLevel(level:LogLevelType){
    return ['silent', 'error', 'warn', 'info', 'debug'].indexOf(level); }

  get currentLogLevel() { return Logger.numifyLevel(this.config.level); }

  isActiveLevel(level: LogLevelType):boolean{
    return this.currentLogLevel >= Logger.numifyLevel(level);}

  isActive(level: LogLevelType):boolean{
    if(!this.isActiveLevel(level)) return false;
    if(this.config.level !== 'debug') return true;
    const {tags} = this.config;
    if(tags.length < 1) return true;
    return new Set(tags).isSubsetOf(new Set(this.tags));
  }

  info   (... args:any[]){log(this,'info',   'info', 'log', 'cyan',  args);}
  success(... args:any[]){log(this,'success','info', 'log', 'green', args);}
  fail   (... args:any[]){log(this,'fail',   'info', 'log', 'red',   args);}
  debug  (... args:any[]){log(this,'debug',  'debug','log', 'yellow',args);}
  warn   (... args:any[]){log(this,'warn',   'warn', 'warn','yellow',args);}
  error  (... args:any[]){log(this,'error',  'error','error','red',  args);}

  tag(... tags:string[]):Logger{ return new Logger(this.config, [... this.tags,... tags]); }
  setTags(... tags: string[]):Logger{ return new Logger(this.config, tags); }

  constructor(config: Partial<LoggerConfigType> = {}, tags?: string[]){
    this.config = { level: 'info', tags: [], showCaller: false, withTrace:false, style: noopChalk, ... config };
    this.tags = tags ?? [];
  }
}
