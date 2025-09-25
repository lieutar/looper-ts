import nodePath from 'path';
import { Init, LazyInit, qoop,  } from 'qoop';
import { quotemeta } from 'looper-utils';

import type { Scroute } from '../app';

export interface AbstractHandlerScriptProps {
  app:          Scroute;
  documentRoot: string;
  file:         string;
  suffix:       string; }
export type AbstractHandlerScriptParams =AbstractHandlerScriptProps;

@qoop({AutoInit:{}})
export class AbstractHandlerScript {
  @Init() declare app          : Scroute;
  @Init() declare documentRoot : string;
  @Init() declare file         : string;
  @Init() declare suffix       : string;
  @LazyInit() get dir () : string { return nodePath.dirname(this.file); }
  @LazyInit() get requestPath(): string{ return "/"+ nodePath.relative(this.documentRoot, this.file)
    .replace(new RegExp( quotemeta(this.suffix) + '$' ), ''); }
  constructor( _params: AbstractHandlerScriptParams){ } }
