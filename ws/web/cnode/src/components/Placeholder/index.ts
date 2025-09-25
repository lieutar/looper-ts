import { AbstractCNode } from "../AbstractCNode";
import { WithTraits } from "qoop";
import { TPhNodeManager } from "./TPhNodeManager";
import { TEntityManager } from "./TEntityManager";
import { TVisibilityManager } from "./TVisiblityManager";
import { TPlaceholderBase } from "./TPlaceholderBase";
import {type PlaceholderParams} from "./types";

export type * from './types';

export class Placeholder extends WithTraits(AbstractCNode,
  TPlaceholderBase,  TPhNodeManager, TEntityManager, TVisibilityManager)
{

  override async dispose(){
    await this.disposeAsPlaceholder();
    await super.dispose();
  }

  constructor(params: PlaceholderParams){ super(params); }

}
