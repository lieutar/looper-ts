import { AbstractComponentStub, type AbstractComponentStubParamsType } from "./AbstractComponentStub";
import { type AbstractCNode, Placeholder, type PlaceholderParams } from "../components";
import { CNodeManager } from "@src/manager";
import type { CNodeNodeSpecType } from "@src/types";
import { gensym } from "looper-utils";

export type PlaceholderStubParams = AbstractComponentStubParamsType & {
  entities?: AbstractCNode[] | null,
  filter?:   PlaceholderParams['filter'],
  cond?:     PlaceholderParams['cond']
};

export type PlaceholderDSLType  =
         [(PlaceholderStubParams | string), ... CNodeNodeSpecType[]] |
         [string, Omit<PlaceholderStubParams,'name'>, ... CNodeNodeSpecType[]];

export class PlaceholderStub extends AbstractComponentStub {

  get __brand_IComponentPlaceholderStub() { return true as true; }
  get filter():PlaceholderParams['filter'] | undefined{ return (this._params as any).filter }
  get cond():PlaceholderParams['cond'] | undefined{ return (this._params as any).cond }
  get entities():PlaceholderParams['entities'] | undefined{ return (this._params as any).entities }

  build(manager: CNodeManager, begin: Node, end: Node ):Placeholder{
    return new Placeholder({
      manager,
      name:   this.name,
      filter: this.filter,
      cond:   this.cond,
      entities: this.entities,
      begin, end }); }

  forceBuild(){
    const manager = CNodeManager.getCurrentManager();
    const {begin, end} = manager.makePlaceholderMarkers(this.name!);
    const div = manager.window.document.createElement('div');
    div.appendChild(begin);
    div.appendChild(end);
    return this.build(manager, begin, end); }

  constructor(params: PlaceholderStubParams){ super({ ... params, name: params.name ?? gensym()}) }

  static build<T extends typeof PlaceholderStub>(this:T, ... args: PlaceholderDSLType):PlaceholderStub{
    const manager = CNodeManager.getCurrentManager();
    const [params, ... rest] = (()=>{
      if('string' !== typeof args[0] ) return args;
      if('string' === typeof args[1] || Array.isArray(args[1])){
        const [name, ... rest] = args;
        return [{name}, ... rest];
      }
      const [name, params, ... rest] = args;
      return [{... params, name}, ... rest];
    })() as [PlaceholderStubParams, ... CNodeNodeSpecType[]];
    const entities = manager.create(({F})=>F(... rest))
    return new this( { ... params, entities } );
  }
}
