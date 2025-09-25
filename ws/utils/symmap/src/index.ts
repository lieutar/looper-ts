export class Symmap {
  private _dict:Map<string,Symbol>=new Map();
  intern(name:string){
    if(!this._dict.has(name)) this._dict.set(name, Symbol.for(name));
    return this._dict.get(name)!; } }
