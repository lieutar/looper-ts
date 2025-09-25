import { AutoInit, Init,  InitTProp,  makeMixer, qoop, Trait } from "qoop";
import type { AbstractCNode } from "../AbstractCNode";

@AutoInit()
@Trait()
@qoop()
export class PlaceholderLogic{

  @Init() declare owner: AbstractCNode & {
    coerce(value:unknown):string;
    _updateDOM(): Promise<void>;
  };

  private _data!: string;
  get data() { return this._data; }

  @InitTProp('value') declare _value: unknown;
  get value() { return this._value; }
  get hasValue() { return this.value !== undefined; }
  async setValue(value: unknown) {
    this._value = value;
    this._data = this.owner.coerce(value);
    await this.owner._updateDOM();
  }

  @InitTProp() declare readonly defaultValue: unknown;
  get hasDefaultValue() { return this.defaultValue !== undefined; }

  _init(){
    this.owner._setDOMBusy();
    this._data = this.owner.coerce(this.hasValue ? this.value : this.defaultValue);
    this.owner.logger.debug('init()', this.owner.toString());
    this.owner._updateDOM()
      .then(() => { this.owner._resolveDOMBusy() })
      .catch((e:unknown) => {
        if(e instanceof Error) throw e;
        throw new Error( String(e) ); }); }
}

export const TStringPlaceholderLogic = makeMixer<Omit<PlaceholderLogic,'_init'>>(PlaceholderLogic);
