import type { AbstractCNode, CNodeManager, CNodeSpecType } from "cnode";
import { Section } from "./Section";

export function articleFilter(src: AbstractCNode[]):AbstractCNode[]{
  if(src.length < 1) return [];
  const manager:CNodeManager = src[0]!.manager;
  let   buf:AbstractCNode[] = [];
  const dst:AbstractCNode[] = [];

  const wrap = ()=>{
    if(buf.length == 0) return;
    const dsl = ['div', {class: 'article-content'}, ... buf] as CNodeSpecType;
    const wrapped = manager.create(({c})=>c(dsl));
    dst.push(wrapped);
    buf = [];
  };
  for(const n of src){
    if(n instanceof Section){
      wrap();
      dst.push(n);
    }else{
      buf.push(n);
    }
  }
  wrap();
  return dst;
}
