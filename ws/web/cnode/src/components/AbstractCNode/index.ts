import { type ICNodeDSLComponentNode } from "../../types";
import { type CNodeManager } from "../../manager";
import { qoop, WithTraits} from "qoop";
import type { PPick } from "looper-utils";
import { TComponentBase } from "./TComponentBase";
import { TOriginalHolder } from "./TOriginalHolder";
import { TDOMBusy } from "./TDOMBusy";
import { TDisposable } from "./TDisposable";

export interface AbstractCNodeProps {
  id: string;
  parent: AbstractCNode | null;
  manager: CNodeManager;
  name: string;
};

export type AbstractCNodeParams = PPick<AbstractCNodeProps, 'manager'>;

@qoop({AutoInit:{}})
export class AbstractCNode
  extends WithTraits( Object, TComponentBase, TOriginalHolder, TDOMBusy, TDisposable )
  implements ICNodeDSLComponentNode
{

  get __brand_ICNodeDSLComponentNode(){ return true as true; }
  constructor (params: AbstractCNodeParams){ super(params); }

  /// pseudo abstract methods ///
  async getWholeNodes():Promise<Node[]>{ throw new Error(); }
  async getFirstNode():Promise<Node|null>{ throw new Error(); }
  async getLastNode():Promise<Node|null>{ throw new Error(); }
  async purgeManagedNodesFromParent(){ throw new Error(); }
}
