import * as fs from 'fs';
import * as midiManager from 'midi-file';

// Read MIDI file into a buffer
const input = fs.readFileSync('melody.mid');

// Convert buffer to midi object
const parsed = midiManager.parseMidi(input);

// Convert object to midi buffer
const output = midiManager.writeMidi(parsed);

// Write into file
const outputBuffer = Buffer.from(output);
fs.writeFileSync('copy_melody.mid', outputBuffer);
