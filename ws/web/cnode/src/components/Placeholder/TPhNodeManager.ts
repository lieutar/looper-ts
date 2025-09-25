import { Init, makeMixer, qoop,} from "qoop";
import type { AbstractCNode } from "../AbstractCNode";

@qoop({AutoInit:{}, Trait:{}})
export class PhNodeManager {
  @Init() declare owner: AbstractCNode & {
    get markers(): {begin:Node, end:Node};
    get data(): AbstractCNode[]
  };

  async getWholeNodes(){
    await this.owner.assertAvailable();

    const {begin, end} = this.owner.markers;
    let node:Node|null = begin;

    const buf = [] as Node[];
    while(node){
      buf.push(node);
      if(node === end) break;
      node = node.nextSibling;
    }

    return buf;
  }

  async getFirstNode(){
    await this.owner.assertAvailable();
    return this.owner.markers.begin;
  }

  async getLastNode(){
    await this.owner.assertAvailable();
    return this.owner.markers.end;
  }

  async purgeManagedNodesFromParent(){
    await this.owner.assertAvailable();
    const {begin, end} = this.owner.markers;
    const parent = begin.parentElement;
    if(!parent) return;
    for( const e of this.owner.data ) await e.purgeManagedNodesFromParent();
    parent.removeChild(begin);
    parent.removeChild(end);
  }

}

export const TPhNodeManager = makeMixer<PhNodeManager>(PhNodeManager);
