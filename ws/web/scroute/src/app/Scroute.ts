import { Logger } from "fancy-logger";
import { Init, qoop } from "qoop";
import type { Constructor } from "looper-utils";

export interface ScrouteProps{ logger: Logger; };

@qoop({AutoInit:{}}) export class Scroute{

  constructor(_params: Partial<ScrouteProps> = {}){}

  @Init((param:any)=>{
    return (param.logger ?? new Logger({})).setTags('scroute');
  }) declare logger: Logger;

  private readonly _services:Map<any, any> = new Map();
  registerService<T extends Constructor>(constructor: T, service: InstanceType<T>){
    if(this._services.has(constructor)) throw new Error(`Service '${constructor.name}' is already registered.`);
    this._services.set(constructor, service); }

  service<T extends Constructor>(constructor: T, fallback?: ()=>InstanceType<T>){
    if(!this._services.has(constructor)){
      if(!fallback) throw new Error(`Service '${constructor.name}' is not registered yet.`);
      this.registerService(constructor, fallback()); }
    return this._services.get(constructor)! as InstanceType<T>; }
}
