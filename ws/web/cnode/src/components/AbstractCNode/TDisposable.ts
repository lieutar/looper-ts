import { Init, makeMixer, qoop, } from "qoop";

@qoop({AutoInit:{}, Trait:{}})
export class Disposable{

  @Init() declare protected readonly owner: {
    assertAvailable():Promise<void>;
    purgeManagedNodesFromParent():Promise<void>;
  };

  private _isAvailable: boolean = true;

  get isAvailable(){ return this._isAvailable; }

  requiresAlive(){
    if(!this.isAvailable) throw new Error( `Dead component` ); }

  async dispose(){
    await this.owner.assertAvailable();
    await this.owner.purgeManagedNodesFromParent();
    this._isAvailable = false; }

}

export const TDisposable = makeMixer<Disposable>(Disposable);
