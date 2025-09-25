import { CNodeBuilder } from "@src/CNodeBuilder";
import { CNodeBuilderContext } from "@src/context";
import { describe, test, expect } from "vitest";
import { MemoryResponseWriter } from 'scroute';
import { ScrouteTestContext } from "scroute/test";

describe('CNodeBuilder', ()=>{
  test('basic', async ()=>{
    const tcx = new ScrouteTestContext();
    class TestBuilder extends CNodeBuilder{
      override async buildCNodeResponse(ctx: CNodeBuilderContext){
        expect(ctx).toBeInstanceOf(CNodeBuilderContext);
      }
    }
    const tb = new TestBuilder({... tcx.makeAHSProps()});
    const res = new MemoryResponseWriter();
    await tb.buildResponse(tcx.makeScriptChainContext(), res);
  });
});
