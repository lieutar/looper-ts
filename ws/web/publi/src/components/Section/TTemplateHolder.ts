import type { Publi } from "@src/app";
import type { AbstractCNode, GenericCNode } from "cnode";
import {Init, InitTProp, makeMixer, qoop } from "qoop";

@qoop({AutoInit:{}, Trait: {}})
export class TemplateHolder{
  @Init() declare owner: AbstractCNode & { publi: Publi; getChildrenIn(name:string):AbstractCNode[] };
  @InitTProp({default: null}) declare readonly template : GenericCNode | null;

  private _activeTemplate : GenericCNode | null = null;
  async getActiveTemplate() : Promise<GenericCNode>{
    await this.owner.assertAvailable();
    if( ! this._activeTemplate ){
      const tmpl =  this.template ?? this.owner.publi.queryTemplate(this.owner) as GenericCNode | null;
      if(!tmpl) throw new Error();
      await tmpl.fillComponents((name:string)=> this.owner.getChildrenIn(name));
      this._activeTemplate = tmpl as GenericCNode;
    }
    return this._activeTemplate!;
  }

  async getWholeNodes():Promise<Node[]>{
    await this.owner.assertAvailable();
    return await (await this.getActiveTemplate()).getWholeNodes(); }

  async getFirstNode(): Promise<Node | null>{
    await this.owner.assertAvailable();
    return (await this.getWholeNodes())[0] || null; }

  async getLastNode(): Promise<Node | null>{
    await this.owner.assertAvailable();
    return (await this.getWholeNodes())[0] || null; }

  async purgeManagedNodesFromParent(){
    await this.owner.assertAvailable();
    await (await this.getActiveTemplate()).purgeManagedNodesFromParent(); }

}

export const TTemplateHolder = makeMixer<TemplateHolder>(TemplateHolder);
