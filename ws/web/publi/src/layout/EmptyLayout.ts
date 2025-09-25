import type { AbstractCNode } from "cnode";
import { AbstractLayout, type AbstractLayoutProps } from "./AbstractLayout";
import type { Contents, Part } from "../pageModels";

export interface EmptyLayoutPropsType extends AbstractLayoutProps{}

export class EmptyLayout extends AbstractLayout {

    // eslint-disable-next-line @typescript-eslint/require-await
  override async apply(_:Part[], contents: Contents):Promise<AbstractCNode>{
    const result = await contents.forceComponents(this.manager);
    if(result.length < 1) throw new Error();
    if(result.length > 1)
      this.manager.logger.warn(`Contents had multi components.`);
    return result[0]!;
  }

  constructor(params: EmptyLayoutPropsType){ super(params); }
}
