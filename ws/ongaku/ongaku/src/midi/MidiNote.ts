import { Init, LazyInit, qoop } from "qoop";
import { TICKS_OF_WHOLE_NOTE, TONE_NAMES } from "./constants";
import type { MidiEvent } from "midi-file";

export type ToneName = typeof TONE_NAMES[number];
export type MidiEventTemplateType = Partial<MidiEvent>

export function isToneName(o:any): o is ToneName {
  return 'string' === typeof o && TONE_NAMES.findIndex(e=>e===o) >= 0
}

export function noteNumberToName (num : number) {
    const name = TONE_NAMES[ num % 12 ];
    const octave = Math.ceil(num / 12) - 1;
    return { octave, name };
}


export interface MidiNoteProps{
octave: number;
name: ToneName;
duration: number;
}

export type MidiNoteParams = MidiNoteProps;

@qoop({AutoInit:{}})
export class MidiNote {
  @Init() declare octave: number;
  @Init() declare name: ToneName;
  @Init() declare duration: number;

  constructor(_params: MidiNoteParams){ }

  @LazyInit() get noteNumber():number{
    const uname = this.name.toUpperCase();
    const mod = TONE_NAMES.findIndex( (s:any) => s === uname );
    return (this.octave + 1) * 12 + mod;
  }

  asEvents(tmpl : MidiEventTemplateType = {}): [MidiEvent, MidiEvent] {
    const on  = { ... tmpl,
      type: 'noteOn',
      noteNumber: this.noteNumber,
      deltaTime: 0,
      velocity: 100
    } as MidiEvent;
    const off = { ... tmpl,
      type: 'noteOff',
      noteNumber: this.noteNumber,
      deltaTime: this.duration,
    } as MidiEvent;
    off.deltaTime += this.duration;
    return [on, off]
  }

  static from(src : string):MidiNote {
    const match = src.match(/^(-?\d*)([A-Gr])(\d*)(?:\.(\d+))?$/i);
    if( !match ) throw new TypeError();
    const octave   = Number.parseInt(match[1] || "4");
    const name = match[2]!.toUpperCase() as ToneName;
    if(!isToneName(name)) throw new Error(`'${name}' is not a ToneName`);
    const durationMain = TICKS_OF_WHOLE_NOTE / Number.parseInt(match[3] || "4");
    const durationSub = match[4] === null ? 0 :
          (Number.parseFloat("0." + (match[4] === "" ? "5" : match[4])));
    const duration   = durationMain + durationMain * durationSub;
    return new DMidiNote( { octave, name, duration } );
  }
}
const DMidiNote = MidiNote;
