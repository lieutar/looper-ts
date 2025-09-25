import { Logger } from "fancy-logger";
import { Init, qoop, WithTraits } from "qoop";
import type { Scroute } from "scroute";
import { TTemplateResolver } from "./TTemplateResolver";

export interface PubliPropsType { logger: Logger; scroute: Scroute; }

@qoop({AutoInit:{}})
export class Publi extends WithTraits( Object, TTemplateResolver) {
  @Init((params:any)=>{
    const logger = (params.logger || params.scroute?.logger || new Logger()).setTags('publi')
    return logger;
  }) declare readonly logger: Logger;
  @Init() declare readonly scroute: Scroute;
  constructor(params: PubliPropsType){ super(params) }
}
