export class ContextStack<T> {
  private _initial:T;
  private _stack:T[];
  constructor(params: {initial:T}){
    this._initial = params.initial;
    this._stack   = [params.initial]; }
  init(... args: []|[T]){ this._stack = [args.length < 1 ? this._initial : args[0]! ]; }
  get current():T{ return this._stack[this._stack.length - 1]!; }
  push(newContext:T):void{ this._stack.push(newContext); }
  pop():T{
    if(this._stack.length < 1) throw new Error();
    return this._stack.pop()!; }
  withContext<TReturn>(contextFactory:(current:T)=>T, action:()=>TReturn){
    const newContext = contextFactory(this.current);
    this.push(newContext);
    try{
      return action();
    }finally{
      this.pop(); } } }
