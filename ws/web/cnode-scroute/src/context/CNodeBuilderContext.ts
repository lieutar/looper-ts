import type { IResponseWriter, IScriptChainContext } from "scroute";
import { AbstractCNode, CNodeManager} from "cnode";
import { AbstractCNodeScrouteContext } from "./AbstractCNodeScrouteContext";
import type { CNodeBuilderProps } from "../CNodeBuilder";
import { Init, LazyInit, qoop } from "qoop";

export interface CNodeBuilderContextParams {
  ctx: IScriptChainContext;
  res: IResponseWriter;
  domFilter: CNodeBuilderProps['domFilter'];
}

@qoop({AutoInit:{}})
export class CNodeBuilderContext extends AbstractCNodeScrouteContext{

  @Init() declare private domFilter: CNodeBuilderProps['domFilter'];
  @Init() declare readonly res: IResponseWriter;

  constructor ( params: CNodeBuilderContextParams ){
    super(params); }

  @LazyInit()
  override get manager() : CNodeManager {
    const EKEY = 'cnode.manager';
    const envman = this.scriptChainContext.get(EKEY);
    if( envman instanceof CNodeManager ) return envman;
    return this._newCNodeManager();
  }

  async writeComponent(root: AbstractCNode){
    const res = this.res;
    await res.header({'Content-Type': 'text/html'});
    const html = await this.domFilter( (await root.getWholeNodes())[0]! as Element); // TODO
    // filter
    await res.write( `<!DOCTYPE html>\n${html.outerHTML}` );
  }

}
