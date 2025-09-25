import { KEY_QOOP } from "./constants";

export interface IQoopProto {[KEY_QOOP]:{}};

export function getQoopProto(proto: {}):IQoopProto{
  if(Object.hasOwn(proto, KEY_QOOP)) return proto as IQoopProto;
  const upper = Object.getPrototypeOf(proto);
  if(!upper) throw new Error(`@qoop wasn't used on given prototype chain.`);
  return getQoopProto(upper);
}

export function getQoopMetaInfo(proto: {}){
  return getQoopProto(proto)[KEY_QOOP];
}

export function getImpl(proto: {}){
  return Object.getPrototypeOf(getQoopProto(proto));
}
