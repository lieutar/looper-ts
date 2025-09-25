import { JSDOM } from 'jsdom';
import { type IScriptChainContext } from "scroute";
import { CNodeManager, type CNodeComponentBuilderType, AbstractCNode } from 'cnode';
import { isComponentThunkType, type ComponentThunkableType, type ComponentThunkType } from './utils';
import { Init, qoop } from 'qoop';

@qoop({AutoInit:{}})
export class AbstractCNodeScrouteContext {

  get manager() : CNodeManager { throw new Error(); };

  @Init('ctx') declare readonly scriptChainContext : IScriptChainContext;
  constructor ( _params: {ctx: IScriptChainContext} ){}

  get(name:string): unknown{ return this.scriptChainContext.get(name); }

  makeComponent(cb: CNodeComponentBuilderType):AbstractCNode{ return this.manager.create(cb); }

  getThunkOrNull(name: string): ComponentThunkType | null{
    const R = this.get(name);
    if(isComponentThunkType(R)) return R;
    if(R) throw new Error();
    return null;
  }

  async useComponent(name:string, fallback?: ComponentThunkableType): Promise<AbstractCNode>{
    const R = this.getThunkOrNull(name);
    if(R) return await R();
    if(fallback) return await fallback();
    throw new Error();
  }

  protected _newCNodeManager() : CNodeManager{
    return new CNodeManager({
      window: new JSDOM('<!DOCTYPE HTML><html></html>').window,
      logger: this.scriptChainContext.app.logger
    });
  }

}
