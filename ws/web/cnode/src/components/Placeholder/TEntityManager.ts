import {  Init, InitTProp, makeMixer, qoop } from "qoop";
import type { AbstractCNode } from "../AbstractCNode";
import type { Placeholder, PlaceholderProps } from ".";
import {genericErrorHandler} from 'looper-utils';
//import { asDomlibDSL } from "domlib";

export type DisposeOptionsType = {keepAlive: boolean};
export const disposeOptionsDefault = {keepAlive: false};

@qoop({AutoInit:{}, Trait:{}})
export class EntityManager{

  //@Init() declare protected owner: AbstractCNode & {markers: {begin:Node, end:Node}};
  @Init() declare protected owner: Placeholder;

  _init(params: {begin:Element, end:Element}){
    this.owner.manager.bindPlaceholder(this.owner, params.begin, params.end);
    this.owner._setDOMBusy();
    //this._data = this.coerce(this.hasValue ? this.value : this.defaultValue);
    this.owner.logger.debug('init()', this.owner.toString());
    this._updateDOM()
      .then(() => { this.owner._resolveDOMBusy() })
      .catch(genericErrorHandler());
  }

  @InitTProp((params:any)=>{
    if(params.filter) return params.filter;
    return (src: AbstractCNode[]) => src;
  })  declare readonly filter: PlaceholderProps['filter'];

  get length(): number { this.owner.requiresAlive(); return this.entities.length; }

  async updateDOM(flag: boolean = true){
    if(flag){
      await this._updateDOM();
    }else{
      await this._clearDOM();
    }
  }

  private async _updateDOM(){
    const frgm = this.owner.manager.document.createDocumentFragment();
    for(const e of this.entities){
      e.setParent(this.owner);
      const nodes = await e.getWholeNodes();
      for(const n of nodes) frgm.appendChild(n);
    }
    const {end} = this.owner.markers;
    const parent = end.parentElement;
    if(!parent) throw new Error();
    parent.insertBefore(frgm, end);
    //console.log('->',asDomlibDSL(parent), String(parent));
  }

  private async _clearDOM(){
    await this.owner.assertAvailable();
    const {begin, end} = this.owner.markers;
    const parent = begin.parentElement;
    if(parent){
      while(begin.nextSibling && begin.nextSibling !== end){
        parent.removeChild(begin.nextSibling); } } }

  @InitTProp({makeDefault: ()=>[]}) declare entities: AbstractCNode[];
  get hasEntities(){ return this.entities.length > 0; }
  async setEntities(entities?: AbstractCNode[]|null ,opt?: DisposeOptionsType):Promise<AbstractCNode[]>{
    await this.owner.assertAvailable();
    const R = await (async ()=>{
      const R:AbstractCNode[] = [];
      for(const old of this.entities){
        R.push(... await (async()=>{
          await this.owner.assertAvailable();
          old.setParent(null);
          await old.purgeManagedNodesFromParent();
          if((opt ?? disposeOptionsDefault).keepAlive) return [old];
          await old.dispose();
          return [];
        })());
      }
      await this._clearDOM();
      return R;
    })();
    this.entities = this.filter(entities ?? []);
    await this._updateDOM();
    return R;
  }
}

export const TEntityManager = makeMixer<Omit<EntityManager,'_init'>>(EntityManager)
