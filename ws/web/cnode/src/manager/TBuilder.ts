import type { AbstractCNode } from "../components";
import { Init,  makeMixer, qoop,  TraitProp} from "qoop";
import { createComponentWithDSL, makeDSLEnv,
  type CNodeComponentBuilderType, type CNodeDSLEnvType, type CNodeFragmentBuilderType
} from "../dsl/manager-utils";
import type { CNodeManager } from "./CNodeManager";

@qoop({AutoInit:{}, Trait: {}})
export class Builder{
  @Init() declare owner: CNodeManager;
  @TraitProp() declare dslEnv:CNodeDSLEnvType;
  create(cb: CNodeComponentBuilderType): AbstractCNode;
  create(cb: CNodeFragmentBuilderType) : AbstractCNode[];
  create(cb: any): any{ return createComponentWithDSL(this.owner, cb); }
  createSome(cb: CNodeFragmentBuilderType) : AbstractCNode[]{ return this.create(cb); }
  _init(){ this.dslEnv = makeDSLEnv(this.owner); }
}

export type IBuilder = Omit<Builder,'_init'>;
export const TBuilder = makeMixer<IBuilder>(Builder);
