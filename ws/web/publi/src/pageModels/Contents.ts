import type {  CNodeFragmentBuilderType, CNodeManager } from "cnode";
import { Init, qoop, } from "qoop";
import type { PExcept } from "looper-utils";

export interface ContentsProps {
  title: string;
  description: string | null;
  requestPath: string;
  components: CNodeFragmentBuilderType;
}
export type ContentsParams = PExcept<ContentsProps, 'description'>

@qoop({AutoInit:{}})
export class Contents {
  @Init() title!: string;
  @Init({default: null}) description!: string | null;
  @Init() requestPath!: string;
  @Init() components!: CNodeFragmentBuilderType;

  // eslint-disable-next-line @typescript-eslint/require-await
  async forceComponents(manager: CNodeManager){
    const result = manager.createSome(this.components);
    result.forEach(c => c.fillValues((key:string)=>({
      title: this.title, description: this.description })[key] ?? null));
    return result;
  }
  constructor(_params: ContentsParams){  }
}
