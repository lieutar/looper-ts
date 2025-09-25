import { Delegate, Init, qoop } from "qoop";
import { CNodeManager, type AbstractCNode } from "cnode";

import { type Part, type PartComponentsType, Contents } from "../../pageModels";


export interface ContentsContextProps {
  manager: CNodeManager;
  parts: Part[];
  contents: Contents;
}

@qoop({AutoInit: {}})
export class ContentsContext{
  @Init() declare manager:  CNodeManager;
  @Init() declare parts:    Part[];
  @Init() declare contents: Contents;

  @Delegate('manager') create!:     CNodeManager['create'];
  @Delegate('manager') createSome!: CNodeManager['createSome'];

  constructor(_params: ContentsContextProps){ }

  private _contentsComponents:AbstractCNode[]|null = null;
  async forceContentsComponents():Promise<AbstractCNode[]>{
    if(!this._contentsComponents)
      this._contentsComponents = await this.contents.forceComponents(this.manager);
    return this._contentsComponents!; }

  private readonly partsMap = new Map<Part, PartComponentsType>();

  async partComponents(at: number):Promise<PartComponentsType>;
  async partComponents(at: number, key: string):Promise<AbstractCNode[]|null>;
  async partComponents(at: number, key?: string):Promise<PartComponentsType|AbstractCNode[]|null>{
    const from = this.parts[at];
    if(!from) throw new Error();
    if(!this.partsMap.has(from)){
      const components = await from.forceComponents(this.manager);
      this.partsMap.set(from, components); }
    const dict = this.partsMap.get(from)!;
    if(!key) return dict;
    return ((dict as any)[key] ?? null) as AbstractCNode[] | null; }

}
