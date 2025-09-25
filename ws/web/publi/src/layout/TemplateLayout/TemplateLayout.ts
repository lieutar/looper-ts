import { Init, qoop } from "qoop";
import { type AbstractCNode, type CNodeDSLEnvType, type GenericCNode } from "cnode";
import type { PExcept } from "looper-utils";

import { type Part, Contents } from "../../pageModels";
import { Section } from "../../components";
import { SectionTemplateResolver } from "../../templateResolvers";
import { AbstractLayout, type AbstractLayoutProps } from "../AbstractLayout";
import { ContentsContext } from "./ContentsContext";

export interface TemplateLayoutProps extends AbstractLayoutProps{
  template:   (env:CNodeDSLEnvType)=>GenericCNode;
  values:     (cc: ContentsContext)=>Promise<(key:string)=>unknown>;
  components: (cc: ContentsContext)=>(key:string)=>Promise<AbstractCNode[]| null>;
  resolver: SectionTemplateResolver;
}

@qoop({AutoInit:{}})
export class TemplateLayout extends AbstractLayout {

  @Init() declare template:   TemplateLayoutProps['template'];
  @Init() declare values:     TemplateLayoutProps['values'];
  @Init() declare components: TemplateLayoutProps['components'];
  @Init({makeDefault(){ return SectionTemplateResolver.vanilla(); }}
  )       declare resolver:   TemplateLayoutProps['resolver'];

  constructor(params: PExcept<TemplateLayoutProps, 'resolver'>){ super(params); }

  override async apply(parts: Part[], contents: Contents): Promise<AbstractCNode> {
    this.publi.templateResolver.register(Section, this.resolver);
    const template = this.manager.create(this.template) as GenericCNode;
    const cc = new ContentsContext({manager:this.manager, parts, contents});
    await template.fillComponents(this.components(cc));
    await template.fillValues(await this.values(cc));
    return template; }
}
