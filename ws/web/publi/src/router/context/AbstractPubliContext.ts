import type { AbstractCNode, CNodeComponentBuilderType } from "cnode";
import type { AbstractCNodeScrouteContext, ComponentThunkType } from "cnode-scroute";
import type { Publi } from "../../app";
import { Section } from "../../components";
import { Delegate, Init, qoop } from "qoop";

export interface AbstractPubliContextParams {
  publi: Publi;
  raw: AbstractCNodeScrouteContext;
}

@qoop({AutoInit:{}})
export class AbstractPubliContext {

  @Init() declare raw:AbstractCNodeScrouteContext;
  get manager(){ return this.raw.manager; }
  @Delegate('raw') get!:           (_:string) => unknown;
  @Delegate('raw') getThunkOrNull!:(_:string) => ComponentThunkType | null;
  @Delegate('raw') useComponent!:  (_:string) => Promise<AbstractCNode>;
  @Delegate('raw') makeComponent!: (_:CNodeComponentBuilderType) => AbstractCNode;

  @Init() declare publi:Publi;
  constructor(_params: AbstractPubliContextParams){  }

  get componentBuildersEnv(){
    return {
      sec: Section.build.bind(Section, this.publi)
    };
  }
}
