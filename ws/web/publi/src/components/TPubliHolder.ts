import type { Publi } from "@src/app";
import { InitTProp, makeMixer, qoop } from "qoop";

@qoop({Trait:{}, AutoInit: {}})
export class PubliHolder{
  @InitTProp() declare readonly publi: Publi;
}

export const TPubliHolder = makeMixer<PubliHolder>(PubliHolder);
