import midi from 'midi-file'
import type { MidiData, MidiEvent, } from 'midi-file'
import yaml   from 'js-yaml'
import nodeFs from 'node:fs/promises'
import {
  TONE_NAMES,
  DIVISION,
  TICKS_OF_WHOLE_NOTE,
  microsecondsPerBeat,
} from './constants';

type MidiEventTemplateType = Partial<MidiEvent>

function noteNameToNumber (name : string, octave = 4){
    const uname = name.toUpperCase();
  const mod = TONE_NAMES.findIndex( (s:any) => s === uname );
    return (octave + 1) * 12 + mod;
}

function noteNumberToName (num : number) {
    const name = TONE_NAMES[ num % 12 ];
    const octave = Math.ceil(num / 12) - 1;
    return { octave, name };
}

function parseSingleNote (src : string) {
    const match = src.match(/^(-?\d*)([A-Gr])(\d*)(?:\.(\d+))?$/i);
    if( !match ) throw new TypeError();
    const octave   = Number.parseInt(match[1] || "4");
    const name     = match[2]!.toUpperCase();
    const durationMain = TICKS_OF_WHOLE_NOTE / Number.parseInt(match[3] || "4");
    const durationSub = match[4] === null ? 0 :
          (Number.parseFloat("0." + (match[4] === "" ? "5" : match[4])));
    const duration   = durationMain + durationMain * durationSub;
    const noteNumber = noteNameToNumber(name, octave);
    return { octave, name, duration, noteNumber };
}

function dslNoteToMidiEvents( src : string , tmpl : MidiEventTemplateType )
: [MidiEvent, MidiEvent] {
  const note = parseSingleNote(src);
  const on  = { ... tmpl,
    type: 'noteOn',
    noteNumber: note.noteNumber,
    deltaTime: 0,
    velocity: 100
  } as MidiEvent;
  const off = { ... tmpl,
    type: 'noteOff',
    noteNumber: note.noteNumber,
    deltaTime: note.duration,
  } as MidiEvent;
  off.deltaTime += note.duration;
  return [on, off]
}

function createMidiDataFromNotes(notes : string[]) : MidiData {
  const track : MidiEvent[] = [{
    deltaTime: 0,
    meta: true,
    type: 'setTempo',
    microsecondsPerBeat
  }];

  for (const dslNote of notes) {
    track.push.apply(track, dslNoteToMidiEvents(dslNote, {}));
  }

  track.push({
    deltaTime: 0,
    meta: true,
    type: 'endOfTrack',
  });

  return {
    header: {
      format: 1,
      numTracks: 1,
      //division: DIVISION,
      ticksPerBeat: DIVISION
    },
    tracks: [track]
  };
}

const notes = "c4 d4 e4".split(" ");
const midiData = createMidiDataFromNotes(notes);
console.log(yaml.dump(midiData))
const buffer = midi.writeMidi(midiData as any);
try {
    await nodeFs.writeFile('melody.mid', Buffer.from(buffer));
    console.log('created: melody.mid');
} catch (error) {
    console.error("Error:", error);
}
