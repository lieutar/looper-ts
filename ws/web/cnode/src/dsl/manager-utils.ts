import {GenericCNode,  type AbstractCNode, type GenericCNodeDSLType, type TextCNodeDSLType } from "../components";
import {PlaceholderStub, TextCNodeStub, type PlaceholderDSLType} from '../stubs';
import { buildCNodeFragment } from "../dsl";
import type { CNodeNodeSpecType } from "../types";
import type { CNodeManager } from "../manager/CNodeManager";

export type CNodeDSLEnvType = {
  c:    (... args: GenericCNodeDSLType) => GenericCNode,
  $:    (... args: TextCNodeDSLType   ) => TextCNodeStub,
  $$:   (... args: PlaceholderDSLType ) => PlaceholderStub,
  F:    (... args: CNodeNodeSpecType[]) => AbstractCNode[],
};

//export type SctionBuilderType = (_:SectionDSLType)=>Section;
export type CNodeComponentBuilderType = (_:CNodeDSLEnvType)=>AbstractCNode;
export type CNodeFragmentBuilderType  = (_:CNodeDSLEnvType)=>AbstractCNode[];
export type CNodeTemplateBuilderType  = (_:CNodeDSLEnvType)=>GenericCNode;

export function makeDSLEnv(manager:CNodeManager):CNodeDSLEnvType{
  return {
    c:   GenericCNode.build.bind(GenericCNode),
    $:   TextCNodeStub.build.bind(TextCNodeStub),
    $$:  PlaceholderStub.build.bind(PlaceholderStub),
    F: (... args: CNodeNodeSpecType[]) => buildCNodeFragment(manager, ...args )
  };
}

let cmStack : CNodeManager[] = [];
export function getCurrentManager() : CNodeManager {
  if( cmStack.length > 0 ) return cmStack[cmStack.length - 1]!;
  throw new Error(`currentManager isn't available now.`);
}

export function createComponentWithDSL<I extends (_:any)=>O,O>(manager: CNodeManager, cb: I): O{
  cmStack.push(manager);
  try{
    return cb((manager as any).dslEnv as CNodeDSLEnvType);
  }finally{
    cmStack.pop();
  }
}
