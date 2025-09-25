export const DIVISION = 480;
export const TICKS_OF_WHOLE_NOTE = DIVISION * 4;
export const TONE_NAMES = ["C","C#","D","D#","E",
                           "F","F#","G","G#","A","A#","B"];
export const BPM = 120;
export const microsecondsPerBeat = 60000000 / BPM;

export const MidiEventDefault  = {
  type: "",
  meta: true,
  velocity: 127,
  channel: 0,
  deltaTime: 0
};
