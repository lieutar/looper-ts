import { Publi } from "@src/app";
import type { Logger } from "fancy-logger";
import { Delegate, Init, LazyInit, makeMixer, qoop } from "qoop";
import type { Scroute } from "scroute";

@qoop({Trait:{}, AutoInit:{}})
export class PubliHolder{
  @Init() declare protected owner: {app: Scroute};
  @LazyInit()
  get publi(){
    return this.owner.app.service(Publi, ()=>{
      return new Publi({ logger: this.owner.app.logger, scroute: this.owner.app });
    }); }
  //*///
  @Delegate('publi', {get: true}) declare readonly logger:Logger
  /*///
  get logger():Logger{
    console.log('>>>>', this.publi, '/', this.publi.logger, '/');
    return this.publi.logger;
  }
  //*///
}

export const TPubliHolder = makeMixer<PubliHolder>(PubliHolder);
