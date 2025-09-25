import type { CNodeManager } from "@src/manager";
import { Init, InitTProp, makeMixer, qoop } from "qoop";
import type { AbstractCNode } from ".";
import { gensym } from "looper-utils";

@qoop({AutoInit:{ prepare: (params:any)=>{
  const id   = params.id   || gensym();
  const name = params.name || id;
  return {... params, id, name};
} }, Trait:{}})
export class ComponentBase{
  @Init() declare protected readonly owner: { requiresAlive():void; };

  @InitTProp() declare readonly manager: CNodeManager;
  get logger(){ return this.manager.logger; }

  @InitTProp() declare readonly id: string;

  @InitTProp() declare readonly name: string;
  get isAnonymous(){ return this.id === this.name; }

  @InitTProp('parent') declare _parent: AbstractCNode | null;
  get parent(){ return this._parent; }
  setParent(parent: AbstractCNode | null){ this._parent = parent; }

  get isRoot() : boolean{
    this.owner.requiresAlive();
    return this.parent === null; }

  toString(){
    const name = this.name === this.id ? '' : `name="${this.name}" `;
    return `<${this.owner.constructor.name} ${name} id="${this.id}"/>` }

  async fillValues(_get:(key:string)=>unknown): Promise<void>{}
  async updateVisibility(_get:(key:string)=>unknown): Promise<void>{}
}

export const TComponentBase = makeMixer<ComponentBase>(ComponentBase);
