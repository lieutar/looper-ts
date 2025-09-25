import { BuilderScript,  type BuilderScriptProps,  type IResponseWriter, type IScriptChainContext } from "scroute";
import { CNodeBuilderContext } from './context';
import { Init, qoop, WithTraits } from "qoop";
import type { PExcept } from "looper-utils";
import { TLoggerHolder } from "./TLoggerHolder";

export type DOMFilterType = (src:Element)=>Promise<Element>;
export interface CNodeBuilderProps extends BuilderScriptProps{ domFilter: DOMFilterType; }
export type CNodeBuilderParams = PExcept<CNodeBuilderProps, 'domFilter'>;

@qoop({AutoInit:{}})
export class CNodeBuilder extends WithTraits( BuilderScript, TLoggerHolder ){

  @Init({makeDefault:(_:any)=>{
    return Promise.resolve.bind(Promise);
  }}) declare domFilter: CNodeBuilderProps['domFilter'];
  setDomFilter(filter: CNodeBuilderProps['domFilter']){ this.domFilter = filter; }

  // pseudo abstract
  async buildCNodeResponse( _ctx: CNodeBuilderContext){ throw new Error(); }

  constructor(params: CNodeBuilderParams){ super(params); }

  override async buildResponse( ctx: IScriptChainContext, res: IResponseWriter ){
    const cnodeCtx = new CNodeBuilderContext({ctx, res, domFilter: this.domFilter});
    this.logger.debug('buildCNodeResponse', this.file);
    await this.buildCNodeResponse(cnodeCtx); }
}
