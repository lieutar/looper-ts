import { AbstractCNode, createComponentWithDSL, type CNodeDSLEnvType, type CNodeManager } from "cnode";
import { Init,  qoop } from "qoop";
import type { SectionDSLType } from "../components";
import type { PExcept } from "looper-utils";

export type PartComponentsType = Omit<SectionDSLType, 'article'>;
export interface PartPropsType {
  title:       string,
  description: string| null,
  requestPath: string,
  components:  (env: CNodeDSLEnvType) => PartComponentsType
}

export type PartParamsType = PExcept<PartPropsType, 'description' | 'components'>;

@qoop({AutoInit:{}})
export class Part<TParams = PartParamsType> {

  @Init() declare title: string;
  @Init({default: null}) declare description: string| null;
  @Init() declare requestPath: string;
  @Init({makeDefault(){ return {} }}) declare components: PartPropsType['components'];

  static defaultComponents = ({$,F}:CNodeDSLEnvType)=>({ title: F($('title')) });

  async forceComponents(manager: CNodeManager){
    const params  = {
      ... createComponentWithDSL(manager, Part.defaultComponents) as SectionDSLType,
      ... createComponentWithDSL(manager, this.components) as SectionDSLType };
    for( const [_key, components] of Object.entries(params) ){
      for( const c of components as AbstractCNode[] ){
        await c.fillValues((key:string)=>{
          return ({title: this.title, description:this.description})[key] ?? null});
      }
    }
    return params;
  }

  constructor(_params: TParams){ }
}

export function isParts(o:any) : o is Part[] {
  if(!Array.isArray(o)) return false;
  for( const e of o ) if(!(e instanceof Part)) return false;
  return true;
}
