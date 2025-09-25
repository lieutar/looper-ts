import { AbstractCNode } from "cnode";
import { CNodeBuilderContext } from "cnode-scroute";
import { Delegate, Init, qoop  } from "qoop";
import { AbstractPubliContext, type AbstractPubliContextParams } from "./AbstractPubliContext";
import { Contents, isParts, type ContentsParamsType } from "../../pageModels";
import { AbstractLayout, isLayoutThunkType } from "../../layout";

export interface PubliBuilderContextPropsType extends AbstractPubliContextParams {
  raw: CNodeBuilderContext
};

@qoop({AutoInit: {}})
export class PubliBuilderContext extends AbstractPubliContext {

  @Init() declare raw: CNodeBuilderContext;
  get res(){     return this.raw.res; }
  @Delegate('raw') writeComponent!: (_:AbstractCNode) => Promise<void>;

  useLayout(name: string) : AbstractLayout{
    const thunk = this.get(`publi.layout.${name}`);
    if(!isLayoutThunkType(thunk)) throw new Error(`Layout '${name}' wasn't defined.`);
    return thunk({manager: this.manager, publi: this.publi});
  }

  async writeContents(params: ContentsParamsType & {layout?: string}){
    const layoutName = params.layout || 'default';
    const layout = this.useLayout(layoutName);
    const parts = this.get('publi.parts') || [];
    if(!isParts(parts)) throw new Error();
    const contents = new Contents({ ... params });
    await this.writeComponent(await layout.apply(parts, contents));
  }

  constructor(params: PubliBuilderContextPropsType){ super(params); }
}
