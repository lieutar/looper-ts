export * from './types';

import { AbstractCNode } from "../AbstractCNode";
import { WithTraits } from "qoop";
import { TElementHolder } from "../traits";
import { buildGenericCNode } from "@src/dsl";
import { TGenericCNodeBase } from "./TGenericCNodeBase";
import type { GenericCNodeDSLType } from "./types";
import { TTextCNodeOwner } from './TTextCNodeOwner';

export class GenericCNode extends WithTraits( AbstractCNode,
  TGenericCNodeBase, TTextCNodeOwner, TElementHolder )
{
  static build(... args: GenericCNodeDSLType ): GenericCNode{ return buildGenericCNode( ... args); }
}
