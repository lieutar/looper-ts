import type { AbstractCNode, CNodeManager } from "cnode";
import { Init, qoop } from "qoop";
import type { Contents, Part } from "../pageModels";
import type { Publi } from "../app";

export interface AbstractLayoutProps {
  manager: CNodeManager,
  publi: Publi
}

@qoop({AutoInit:{}})
export class AbstractLayout {

  @Init() manager!: CNodeManager;
  @Init() publi!: Publi;

  // pseudo abstract
  async apply(_parts: Part[], _contents: Contents):Promise<AbstractCNode>{ throw new Error(); }

  constructor(_params: AbstractLayoutProps){}
}

export type LayoutBuilderType = (commonProps: AbstractLayoutProps) => AbstractLayout;
export type LayoutThunkType = LayoutBuilderType & [__brand_LayoutBuilderThunk: true]

export function isLayoutThunkType (o:any): o is LayoutThunkType {
  return ('function' === typeof o) && (o as any).__brand_LayoutBuilderThunk;
}

export function asLayoutThunk(src: LayoutBuilderType){
  (src as any).__brand_LayoutBuilderThunk = true as true;
  return src as LayoutThunkType;
}
