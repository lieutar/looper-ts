import { CNodeAction, CNodeChainContext } from "cnode-scroute";
import { qoop, WithTraits } from "qoop";
import { PubliChainContext } from "./context/PubliChainContext";
import { TPubliHolder } from "./TPubliHolder";

@qoop()
export class PubliAction extends WithTraits( CNodeAction, TPubliHolder) {
  async publiAction(_ctx: PubliChainContext) : Promise<void>{ throw new Error(); }

  override async cnodeAction(ctx: CNodeChainContext){
    await this.publiAction(new PubliChainContext({
      publi: this.publi,
      raw: ctx}));
  }
}
