import type { CNodeManager } from "@src/manager";
import { Init, makeMixer, qoop } from "qoop";

@qoop({AutoInit:{}, Trait:{hide: (_:any)=> false}})
export class DOMBusy {

  @Init() declare protected readonly owner: { id:string; manager: CNodeManager; requiresAlive():void };

  protected _domReadyPromise:          Promise<void>            | null = null;
  protected _domReadyPromise_resolver: (() => void)             | null = null;
  protected _domReadyPromise_rejector: ((reason?: any) => void) | null = null;

  get isDOMBusy(){ return this._domReadyPromise !== null; }

  _setDOMBusy(): void {
    if (this.isDOMBusy) {
      console.warn(`Component '${this.owner.id}' is already busy.`);
      return;
    }
    this.owner.manager.logger.tag('DOMBusy').debug(`_setDOMBusy ${this}`);
    this._domReadyPromise = new Promise((resolve, reject) => {
      this._domReadyPromise_resolver = resolve;
      this._domReadyPromise_rejector = reject;
    });
  }

  _resolveDOMBusy(): void {
    if (!this.isDOMBusy) {
      console.warn(`Component '${this.owner.id}' was not busy.`);
      return;
    }
    this.owner.manager.logger.tag('DOMBusy').debug(`_resolveDOMBusy ${this}`);
    if (this._domReadyPromise_resolver) {
      this._domReadyPromise_resolver();
      this._domReadyPromise_resolver = null;
      this._domReadyPromise_rejector = null;
    }
  }

  async assertAvailable(){
    this.owner.requiresAlive();
    if(!this.isDOMBusy) return;
    await this._domReadyPromise;
  }
}

export const TDOMBusy = makeMixer<DOMBusy>(DOMBusy);
