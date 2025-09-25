import midi from 'midi-file';
import { Init, qoop } from "qoop";
import type { MidiNote } from "./MidiNote";
import type { MidiData } from "midi-file";
import { DIVISION, microsecondsPerBeat } from "./constants";

export interface MidiSongProps{
notes: MidiNote[]
};

export type MidiSongParams = MidiSongProps;

@qoop({AutoInit:{}})
export class MidiSong{
  constructor(_params:MidiSongParams){}

  @Init() declare notes: MidiNote[];
  get data() : MidiData{
    return {
      header: {
        format: 1,
        numTracks: 1,
        //division: DIVISION,
        ticksPerBeat: DIVISION
      },
      tracks: [ [
        {
          deltaTime: 0,
          meta: true,
          type: 'setTempo',
          microsecondsPerBeat
        },
        ... this.notes.map(n=>n.asEvents()).flat(1),
        {
          deltaTime: 0,
          meta: true,
          type: 'endOfTrack',
        }
      ]]
    };
  }

  asArray():Array<number>{ return midi.writeMidi(this.data); }
  asBuffer():Buffer{ return Buffer.from(this.asArray()); }

}
