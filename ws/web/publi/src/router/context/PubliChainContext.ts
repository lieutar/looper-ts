import * as nodePath from 'node:path';
import { type CNodeComponentBuilderType } from "cnode";
import { type CNodeChainContext, type ComponentModifierType } from "cnode-scroute";
import { Delegate, Init, qoop } from "qoop";
import { ActionScript, FsRouter, type IActionResult } from "scroute";
import { AbstractPubliContext, type AbstractPubliContextParams } from "./AbstractPubliContext";
import { asLayoutThunk, type LayoutBuilderType } from "../../layout";
import { isParts, Part, type PartParamsType } from "../../pageModels";

export interface PubliChainContextPropsType extends AbstractPubliContextParams{
  raw: CNodeChainContext
};

@qoop({AutoInit: {}})
export class PubliChainContext extends AbstractPubliContext{

  @Init() declare raw:CNodeChainContext;
  @Delegate('raw') newResult!:       () => IActionResult;
  @Delegate('raw') storeEnv!:        (_:Record<string, unknown>) => void;
  @Delegate('raw') defineComponent!: (name:string, cb:CNodeComponentBuilderType)=>void;
  @Delegate('raw') modifyComponent!: (name:string, cb:ComponentModifierType)=>void;

  protected _defineLayout(params: {layout: LayoutBuilderType, name: string}){
    const layoutName = params.name;
    const builder    = params.layout;
    this.storeEnv({[`publi.layout.${layoutName}`]: asLayoutThunk(builder)}); }

  defineLayout(params: {layout: LayoutBuilderType, name?: string}){
    const layoutName = params.name ?? 'default';
    if(layoutName === 'EMPTY') throw new Error(`Layout name 'EMPTY' is reserved.`);
    this._defineLayout({layout: params.layout, name: layoutName}); }

  async addPart(params: Omit<PartParamsType, 'requestPath'> & {action: ActionScript}){
    const requestPath = await (async ()=>{
      const src      = params.action.requestPath;
      if(!this.publi) throw new Error('publi is undefined');
      if(!this.publi.scroute) throw new Error('publi.scroute is undefined');
      const fsRouter = this.publi.scroute.service(FsRouter);
      if(nodePath.basename( params.action.file ) !== fsRouter.actionSuffix) return src;
      return await fsRouter.findIndex(src);
    })();
    const upper = (()=>{
      const stored = this.get('publi.parts');
      if(isParts(stored)) return stored;
      return []; })();
    this.storeEnv({'publi.parts': [... upper, new Part({... params, requestPath})]}); }

  constructor(params: PubliChainContextPropsType){ super(params); }
}
