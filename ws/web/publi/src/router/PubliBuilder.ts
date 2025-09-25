import * as nodePath from 'node:path';
import { CNodeBuilder, CNodeBuilderContext, type CNodeBuilderParams, type CNodeBuilderProps } from "cnode-scroute";
import { qoop, WithTraits } from "qoop";
import { PubliBuilderContext } from "./context/PubliBuilderContext";
import { makeHtmlLinksRelative } from 'domlib';
import { TPubliHolder } from './TPubliHolder';

export interface PubliBuilderProps extends CNodeBuilderProps{}
export type PubliBuilderParams = CNodeBuilderParams;

@qoop()
export class PubliBuilder extends WithTraits( CNodeBuilder, TPubliHolder) {

  constructor (params: PubliBuilderParams){
    super(params);
    // eslint-disable-next-line @typescript-eslint/require-await
    if(!params.domFilter) this.setDomFilter(async (src:Element):Promise<Element>=>{
      const baseUrl = nodePath.dirname(this.requestPath);
      return makeHtmlLinksRelative(src, baseUrl);
    })
  }

  async buildPubliResponse(_ctx: PubliBuilderContext) : Promise<void> {throw new Error()}

  override async buildCNodeResponse(ctx: CNodeBuilderContext){
    await this.buildPubliResponse(new PubliBuilderContext( {
      publi: this.publi,
      raw: ctx} ) );
  }
}
