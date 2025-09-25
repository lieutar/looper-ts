import { CNodeAction , CNodeChainContext } from "@src/index";
import { Logger } from "fancy-logger";
import { ScrouteTestContext } from "scroute/test";
import { describe, expect, test } from "vitest";

describe('CNodeAction', ()=>{
  test('basic',()=>{
    const tcx = new ScrouteTestContext();
    class TestAction extends CNodeAction {
      override async cnodeAction(ctx: CNodeChainContext){
        //console.log('!!!!');
        expect(ctx).toBeInstanceOf(CNodeChainContext);
      }
    }
    const ta = new TestAction( { ... tcx.makeAHSProps() } );
    const rs = ta.execute(tcx.makeScriptChainContext());
    expect(!!rs).toBe(true);
    expect(ta.logger).toBeInstanceOf(Logger);
  })
});
