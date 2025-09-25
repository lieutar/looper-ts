import nodePath from 'path';
import { isDirectory, readDir } from 'looper-utils';
import { type IHttpRequest } from '../http';
import { StaticResponseWriter } from '../writer';
import { FsRouter } from '../router/FsRouter';
import { ScriptChainContextRoot, type IScriptChainContext } from '../builder';
import { Delegate, Init, qoop } from 'qoop';
import { quotemeta } from 'looper-utils';
import type { Scroute } from '@src/app';
import type { Logger } from 'fancy-logger';

export interface StaticDriverProps { router: FsRouter; distDir: string; };

@qoop({AutoInit: {}})
export class StaticDriver{
  /**
   */
  constructor (_params : StaticDriverProps){}

  @Init() declare distDir: string;
  @Init() declare router: FsRouter;
  @Delegate('router',{get:true}) declare readonly documentRoot: string;
  @Delegate('router',{get:true}) declare readonly actionSuffix: string;
  @Delegate('router',{get:true}) declare readonly app: Scroute;
  @Delegate('router',{get:true}) declare readonly logger: Logger;
  get isDebug(){ return this.logger.config.level === 'debug'; }


  /** Get HTTP requests from handlers on the file-system.
   */
  async plan() : Promise<IHttpRequest[]> {
    const actionPattern = new RegExp(`${quotemeta(this.actionSuffix)}$`);
    const router        = this.router;
    const documentRoot  = this.documentRoot;
    const plan = async ( dir : string , src : string ):Promise<IHttpRequest[]> =>{
      if(!(await isDirectory(dir))) throw new Error(`${dir} is not a directory.`);
      const entries = await readDir( dir );
      const result = [];
      for( const entry of entries ){
        const {name} = entry;
        if(name.match(actionPattern)) continue;
        const epath = nodePath.join( dir, name );
        if ( entry.isDirectory() ){
          result.push(  ... await plan( epath , src ) );
        } else {
          result.push( ... await router.fileToRequests( epath ) );
        }
      }
      return result;
    };
    return await plan( documentRoot, documentRoot );
  }

  /** Build pages from the document-root.
   */
  async build() : Promise<void> {
    const debug   = this.isDebug || true;
    const router  = this.router;
    const distDir = this.distDir;
    const jobs : Promise<void>[] = [];
    for( const req of  await this.plan() ){

      const builder = await router.requestToScriptChain(req);
      const context:IScriptChainContext = new ScriptChainContextRoot({isStatic:true, request:req, app:this.app});
      const writer = new StaticResponseWriter({path: nodePath.join(distDir, req.path)});
      const job = (async () => {
        const path = nodePath.relative( process.cwd(), writer.path );
        this.logger.debug('start process', path);
        await builder.buildResponse( context, writer );
        await writer.close();
        this.logger.success( path );
      })();
      if(debug){
        await job;
      }else{
        jobs.push(job);
      }
    }
    if(!debug) await Promise.all(jobs);
  }

}
