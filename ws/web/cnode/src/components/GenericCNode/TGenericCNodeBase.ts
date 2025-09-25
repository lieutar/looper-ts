import { AbstractCNode } from "../AbstractCNode";
import type { DisposeOptionsType } from "../Placeholder";
import { Init, makeMixer, qoop } from "qoop";
import type { PlaceholderDictType } from "./types";

@qoop({AutoInit:{}, Trait:{}})
export class GenericCNodeBase {

  @Init() declare protected owner: AbstractCNode;

  // placeholders
  @Init('placeholders') declare private _placeholders: PlaceholderDictType;

  get placeholders(){
    this.owner.requiresAlive();
    return Object.values(this._placeholders); }

  get children(){
    this.owner.requiresAlive();
    return [ ...  this.placeholders.map(ph => ph.entities)].flat() }

  get blankPlaceholders(){
    this.owner.requiresAlive();
    return this.placeholders.filter(ph => !ph.hasEntities); }

  async setChild(name: string, child: AbstractCNode, opt?: DisposeOptionsType){
    await this.owner.assertAvailable();
    await this.setChildren(name, [child], opt); }

  async setChildren(name: string, children: AbstractCNode[], opt?: DisposeOptionsType){
    await this.owner.assertAvailable();
    if(!( name in  this._placeholders)) throw new Error();
    const ph = this._placeholders[name]!;
    return ph.setEntities(children, opt); }

  async addChildren(name: string, ... children: AbstractCNode[]){
    await this.owner.assertAvailable();
    if(!(name in this._placeholders)) throw new Error();
    await this._placeholders[name]!.setEntities(children); }

  getChildren(name: string): AbstractCNode[] | null{
    this.owner.requiresAlive();
    const ph = this._placeholders[name];
    if(!ph) throw new Error(`undefined child: '${name}'`);
    return ph.entities as AbstractCNode[] ?? null; }

  async fillComponents(get: (name:string)=>unknown){
    await this.owner.assertAvailable();
    for( const ph of this.blankPlaceholders ){
      const filter = async (value:unknown)=>{
        if(value === null || value === undefined) return null;
        if(value instanceof AbstractCNode) return [value];
        if(Array.isArray(value)          ) return value.filter(e => e instanceof AbstractCNode);
        if(value instanceof Promise      ) return filter(await value);
        throw new Error(`Malformed components '${value}'`); };
      const frgm = await filter(get(ph.name));
      if(frgm) await ph.setEntities(frgm);
    }
  }

  //

  async updateVisibility(get: (name:string)=>unknown){
    await this.owner.assertAvailable();
    await Promise.all(this.children.map( c =>  c.updateVisibility(get) ));
  }

  _init(){
    for(const ph of Object.values(this._placeholders)) ph.setParent(this.owner);
  }
}

export const TGenericCNodeBase = makeMixer<Omit<GenericCNodeBase,'_init'>>(GenericCNodeBase);
