import { ActionScript, type ActionScriptParams, type IActionResult, type IScriptChainContext } from "scroute";
import { CNodeChainContext } from "./context";
import {  WithTraits } from "qoop";
//import { qoop, AfterInit } from 'qoop';
import { TLoggerHolder } from "./TLoggerHolder";

export interface CNodeActionParams extends ActionScriptParams{}
//@qoop({AutoInit:{}})
export class CNodeAction extends WithTraits( ActionScript, TLoggerHolder) {

  constructor(params:CNodeActionParams){ super(params); }

  // pseudo abstract
  async cnodeAction(_ctx: CNodeChainContext) : Promise<void>{ throw new Error(); }

  override async execute(ctx:IScriptChainContext) : Promise<IActionResult> {
    const wctx = new CNodeChainContext( { ctx } );

    if(!this.logger) console.log('this.logger is undefined ... ', Object.keys(this));
    this.logger.debug('cnodeAction', this.file);
    await this.cnodeAction(wctx);
    const rs = wctx.newResult();
    return rs;
  }
}
