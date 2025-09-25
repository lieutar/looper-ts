import yaml from 'js-yaml';
import midi from 'midi-file';
import fs from 'node:fs/promises';

//const mid = await fs.readFile('menuettm.mid');
//const mid = await fs.readFile('melody.mid');
const mid = await fs.readFile('new.mid');
const parsed = midi.parseMidi(mid);
console.log( yaml.dump( parsed ) );
