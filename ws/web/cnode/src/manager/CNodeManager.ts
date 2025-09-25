import type { IWindow } from "domlib";
import type { Logger } from 'fancy-logger';
import { Init, qoop, WithTraits } from 'qoop';
import { gensym } from "looper-utils";
import { getCurrentManager } from "@src/dsl/manager-utils";
import { TBuilder} from "./TBuilder";
import { TMarkerManager } from "./TMarkerManager";
import { TNodeManager } from "./TNodeManager";

@qoop({AutoInit:{}})
export class CNodeManager extends WithTraits(Object, TNodeManager, TMarkerManager, TBuilder)
{
  @Init((params:any)=>(params.logger).setTags('cnode')) declare logger: Logger;
  @Init() declare window: IWindow;
  get document(): Document { return this.window.document; }
  static getCurrentManager = getCurrentManager;
  //////////////////////////////////////////////////////////////////////////////
  gensym(): string { return `cnode-${gensym()}` }
  //////////////////////////////////////////////////////////////////////////////
  constructor (params: {window: IWindow, logger: Logger}){ super(params); }
  //////////////////////////////////////////////////////////////////////////////
}
