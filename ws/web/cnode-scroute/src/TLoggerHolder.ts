import type { Logger } from "fancy-logger";
import { Init, LazyInit, makeMixer, qoop } from "qoop";
import type { Scroute } from "scroute";
@qoop({AutoInit:{},Trait:{}}) export class LoggerHolder{
  @Init() declare owner: { app:Scroute };
  @LazyInit() get logger():Logger{
    console.log('LazyInit ... logger!!!');
    return this.owner.app.logger.setTags('cnode-scroute'); } }
export const TLoggerHolder = makeMixer<Omit<LoggerHolder,'owner'>>(LoggerHolder);
