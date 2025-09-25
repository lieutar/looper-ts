import { Publi } from "@src/index";
import { TCNodeDOMTools } from "cnode/test";
import { AfterInit, qoop, TraitProp, WithTraits } from "qoop";
import { TScrouteTestContext } from "scroute/test";

@qoop({AutoInit:{}, Trait: {}})
export class PubliTestContext extends WithTraits(Object, TScrouteTestContext, TCNodeDOMTools){
  @TraitProp() declare publi: Publi;
  @AfterInit() protected _initPubli(){
    this.publi = new Publi({scroute: this.scroute, logger: this.logger}); }
}
