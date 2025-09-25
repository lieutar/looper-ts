import type { AbstractCNode } from "cnode";

export type ComponentThunkableType = () => Promise<AbstractCNode>

export type ComponentThunkType = ComponentThunkableType & { __brand_ComponentThunk: true };
export function isComponentThunkType (o:any) : o is ComponentThunkType {
  return ('function' === typeof o) && (o as any).__brand_ComponentThunk;
}

export function asComponentThunk(src: ComponentThunkableType) : ComponentThunkType {
  (src as any).__brand_ComponentThunk = true as true;
  return src as ComponentThunkType;
}

export type ComponentModifierType = (component:AbstractCNode)=>Promise<AbstractCNode>;
