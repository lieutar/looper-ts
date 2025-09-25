import yaml   from 'js-yaml'
import nodeFs from 'node:fs/promises'
import { MidiNote } from './src/midi/MidiNote';
import { MidiSong } from './src/midi/MidiSong';

const notes = "c4 d4 e4".split(" ").map(MidiNote.from.bind(MidiNote));
const song = new MidiSong({notes});
console.log(yaml.dump(song.data))
try {
  await nodeFs.writeFile('melody.mid', song.asBuffer());
  console.log('created: melody.mid');
} catch (error) {
  console.error("Error:", error);
}
