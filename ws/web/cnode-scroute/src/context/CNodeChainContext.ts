import  { type ActionResultEnvType, type ActionResultOptType, type IActionResult, } from "scroute";
import { CNodeManager, type CNodeComponentBuilderType  } from "cnode";
import { AbstractCNodeScrouteContext } from "./AbstractCNodeScrouteContext";
import { asComponentThunk, type ComponentModifierType } from "./utils";

export class CNodeChainContext extends AbstractCNodeScrouteContext{

  private _storedEnv: ActionResultEnvType = {};
  private _storedResultOpt: ActionResultOptType = {};

  newResult() : IActionResult{
    return this.scriptChainContext.newResult(this._storedEnv, this._storedResultOpt); }

  override get manager() : CNodeManager {
    const EKEY = 'cnode.manager';
    const envman = this.scriptChainContext.get(EKEY);
    if( envman instanceof CNodeManager ) return envman;
    const stman = this._storedEnv[EKEY];
    if( stman instanceof CNodeManager ) return stman;
    this._storedEnv[EKEY] = this._newCNodeManager();
    return this._storedEnv[EKEY] as CNodeManager;
  }

  storeEnv(values: {[name:string]:unknown}){
    for(const [key, value] of Object.entries(values)){
      if(key in this._storedEnv) throw new Error(`key ${key} was already set.`);
      this._storedEnv[key] = value;
    }
  }

  defineComponent(name:string, cb:CNodeComponentBuilderType) : void{
    // eslint-disable-next-line @typescript-eslint/require-await
    const thunk = asComponentThunk(async () =>  this.manager.create(cb));
    this.storeEnv({ [name]: thunk });
  }

  modifyComponent(name: string, cb: ComponentModifierType){
    const defined = this.getThunkOrNull(name);
    if(!defined) throw new Error();
    this.storeEnv({ [name]: asComponentThunk(async ()=> await cb(await defined()))});
  }

}
