import {  Init, InitTProp, makeMixer, qoop } from "qoop";
import type { PlaceholderProps } from ".";
import type { AbstractCNode } from "../AbstractCNode";

@qoop({AutoInit:{}, Trait:{}})
export class VisibilityManager{

  @Init() declare protected owner: AbstractCNode & {
    entities: AbstractCNode[];
    updateDOM(arg:any): Promise<void>;
  };

  async updateVisibility(get: (key:string) => unknown){
    await this.owner.assertAvailable();
    await Promise.all(this.owner.entities.map((c:AbstractCNode) => c.updateVisibility(get)));
    await this.owner.updateDOM(this.cond(get)); }

  @InitTProp({default: (_:any)=>true}) declare readonly cond: PlaceholderProps['cond'];
}

export const TVisibilityManager = makeMixer<VisibilityManager>(VisibilityManager);
