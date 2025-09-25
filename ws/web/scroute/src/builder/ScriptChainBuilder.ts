import { Init, qoop } from "qoop";
import type { Scroute } from "../app";
import { ScriptChainContext, type IScriptChainContext } from './context';
import type { IResponseWriter } from "../writer";
import type { IResponseBuilder } from "./types";
import type { ActionScript } from "../script";

export interface ScriptChainBuilderProps{
    app: Scroute;
    actions: ActionScript[];
    defaultBuilder: IResponseBuilder;
}

/**
 * Runner of script chain for response building.
 * Building the chain isn't this class' responsibility.
 * See Also: `FsRouter`.
 */
@qoop({AutoInit: {}})
export class ScriptChainBuilder implements IResponseBuilder{

  @Init() declare app:            Scroute;
  @Init() declare actions:        ActionScript[];
  @Init() declare defaultBuilder: IResponseBuilder;

  constructor(_params: ScriptChainBuilderProps){  }

  async buildResponse(context:IScriptChainContext, writer: IResponseWriter){

    const loop = async ( actions: ActionScript[], context:IScriptChainContext ) => {
      const mod = actions[0];

      // runs .action.ts Actions ///////////////////////////////////
      if( 'undefined' !== typeof mod ){
        const newResult  = await mod.execute( context ); // ActionScript#execute
        const newContext = new ScriptChainContext({
          app:       this.app,
          previous:  context,
          handlesBy: mod,
          result:    newResult});
        return await loop(actions.slice(1), newContext)
      }

      // runs selected resource handler. ///////////////////////////
      await context.result.builder.buildResponse( context, writer );
      return;
    };

    return await loop(
      this.actions as ActionScript[],
      new ScriptChainContext({
        app: this.app as any,
        previous: context,
        result: { aborted: false, builder: this.defaultBuilder, env: {} }}));
  }
}
