import type { Constructor } from "looper-utils";
import { KEY_QOOP } from "./constants";
import { AutoInit, type AutoInitOptions } from "@src/AutoInit";
import { Trait, type TraitOptions } from "@src/Trait";

export interface qoopOptions{
  meta?: any,
  AutoInit?: AutoInitOptions,
  Trait?: TraitOptions,
}

function qoopInternal(meta:any = {}){
  return <T extends Constructor>(Base: T)=>{
    class QoopClass extends Base {declare [KEY_QOOP]:{}}
    QoopClass.prototype[KEY_QOOP] = meta || {};
    return QoopClass;
  }
}

export function qoop(opt: qoopOptions = {}){
  return <T extends Constructor>(Base: T)=>{
    let              NewClass = qoopInternal(opt.meta || {})(Base);
    if(opt.Trait   ) NewClass = Trait(opt.Trait            )(NewClass);
    if(opt.AutoInit) NewClass = AutoInit(opt.AutoInit      )(NewClass);
    return NewClass;
  };
}
