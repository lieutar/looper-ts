import type { AbstractCNode } from "cnode";
import { Init, makeMixer, qoop } from "qoop";
import { Section } from "./Section";

@qoop({AutoInit:{}, Trait: {}})
export class SectionDepthCalculator {
  @Init() declare protected owner: AbstractCNode;

  get depth() : number{
    this.owner.requiresAlive();
    if(this.owner.isRoot) return 0;
    let node = this.owner.parent;
    while(node && !(node.original instanceof Section)){
      node = node.parent;
    }
    if(!node) return 0;
    return (node.original as any).depth + 1;
  }
}

export const TSectionDepthCalculator = makeMixer<SectionDepthCalculator>(SectionDepthCalculator);
