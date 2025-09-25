import { Init, qoop } from "qoop";
import { type AbstractCNode, type CNodeManager } from "cnode";
import { AbstractLayout, type AbstractLayoutProps } from "./AbstractLayout";
import type { Contents, Part } from "../pageModels";
import { Section } from "../components";

export interface NestedSectionLayoutProps extends AbstractLayoutProps{}

@qoop({AutoInit:{}})
export class NestedSectionLayout extends AbstractLayout{

  // override
  @Init() declare manager: CNodeManager;

  override async apply(parts: Part[], contents: Contents):Promise<AbstractCNode>{
    const publi   = this.publi;
    const manager = this.manager;
    const loop = async (generated: AbstractCNode[] , parts:Part[])=>{
      if(parts.length < 1) return generated;
      const [last, ... rest] = parts;
      if(!last) throw new Error();
      const params = await last.forceComponents(manager);
      const sect = new Section({ ... params, manager, publi});
      if(generated) sect.addChildren('article', ... generated);
      return await loop([sect], rest);
    };
    const result = await loop(await contents.forceComponents(this.manager), parts.reverse());
    if(result.length < 1) throw new Error();
    return result[0]!;
  }

  constructor(params: NestedSectionLayoutProps){ super(params); }
}
