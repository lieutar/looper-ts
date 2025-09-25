import { Delegate, Init, qoop } from "qoop";
import Color from "colorjs.io";

export interface EeroProps{
raw: Color
}

export type ColorConstructorArgs = [string] | [number, number, number] | [number, number, number, number] | [object];
export type EeroFromArgs = ColorConstructorArgs | [Eero];

@qoop({AutoInit: {}})
export class Eero {
  @Init() declare raw: Color;
  @Delegate('raw') declare readonly toString: (... args:any[])=>string;
  //toString(... args:any[]){ return this.raw.toString(... args); }

  mod(cb:(src:Color)=>void):Eero{
    const cloned = this.raw.clone();
    cb(cloned);
    return new DEero({raw: cloned });
  }

  constructor(_params: EeroProps){  }

  static from(... args: EeroFromArgs):Eero{
    if(args[0] instanceof DEero) return new DEero({raw: args[0].raw});
    // This [any] is lie, but required by TS's mysterious behavior.
    // Plus, ConstructorParameters<Color> couldn't work.
    const raw = new Color( ... (args as [any]) );
    return new DEero({raw});
  }
}

const DEero = Eero;
