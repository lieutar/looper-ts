import { AbstractCNode, CNodeManager, GenericCNode, type AbstractCNodeParams } from "cnode";
import { SectionTemplateResolver } from "../../templateResolvers";
import type { Publi } from "../../app";
import { qoop, WithTraits } from "qoop";
import { TPartsHolder } from "./TPartsHolder";
import { TTemplateHolder } from "./TTemplateHolder";
import { TPubliHolder } from "../TPubliHolder";
import { TSectionDepthCalculator } from "./TSectionDepthCalculator";

export type SectionDSLType = {
  title?:    AbstractCNode[]| null,
  header?:   AbstractCNode[]| null,
  headNav?:  AbstractCNode[]| null,
  article?:  AbstractCNode[]| null,
  footer?:   AbstractCNode[]| null,
  footNav?:  AbstractCNode[]| null,
  template?: GenericCNode   | null,
};

export type SectionParams = AbstractCNodeParams & SectionDSLType & {publi: Publi};

@qoop({AutoInit: {}})
export class Section extends WithTraits( AbstractCNode,
  TPartsHolder, TTemplateHolder, TPubliHolder, TSectionDepthCalculator) {

    constructor(params: SectionParams){
      super(params); }

  static getDefaultTemplateResolver(){ return new SectionTemplateResolver(); }

  static build<T extends typeof Section>(this: T, publi:Publi, params: SectionDSLType): Section{
    const manager = CNodeManager.getCurrentManager();
    return new this({manager,publi, ... params});
  }
}
