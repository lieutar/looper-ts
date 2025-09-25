import { Logger } from "fancy-logger";
import { Delegate, makeMixer, qoop, TraitProp } from "qoop";
import { ScriptChainContext, ScriptChainContextRoot, Scroute, HttpRequest,
  type IScriptChainContext, type IResponseWriter } from "@src/index";


@qoop({AutoInit:{}, Trait: {}})
export class ScrouteTestContext {
  @TraitProp() readonly scroute = new Scroute();
  @Delegate('scroute', {get:true}) declare readonly logger: Logger;
  makeAHSProps(){
    return {
    app: this.scroute,
      documentRoot: '/tmp',
      file: '/tmp/foo.ts',
      suffix: '.ts'
    };
  }

  makeScriptChainContext(){
    return new ScriptChainContext({
      app: this.scroute,
      previous: new ScriptChainContextRoot({
        isStatic: true,
        request: new HttpRequest({}),
        app: this.scroute,
      }),
      result: {
        aborted: false,
        env: {},
        builder: {
          buildResponse: (_ctx:IScriptChainContext, _writer:IResponseWriter)=>{return new Promise((rs)=>{rs()})}
        }
      }
    });
  }

}

export const TScrouteTestContext = makeMixer<ScrouteTestContext>(ScrouteTestContext);
