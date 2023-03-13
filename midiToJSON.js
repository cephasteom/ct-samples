const { Midi } = require('@tonejs/midi')
const fs = require('fs');
const path = require('path');

// TODO: iterate over all files in a directory and compile to JSON Object
const midiFile = path.resolve('./midi/dnb1/bass.mid')
const midiData = fs.readFileSync(midiFile)
const midi = new Midi(midiData)
const quant = 48 // 48 divisions per cycle - to match zen
const timeSig = midi.header.timeSignatures[0].timeSignature[0]
const endTick = Math.floor(midi.tracks[0].endOfTrackTicks / 480 / timeSig) * timeSig * 480
const notes = midi.tracks[0].notes

const ticksPerDivision = 480 / (quant / 4)

const grouped = notes.reduce((groups, note) => ({
    ...groups,
    [(note.ticks/ticksPerDivision)]: [
        ...(groups[(note.ticks/ticksPerDivision)] || []),
        note
    ].sort((a, b) => a.midi < b.midi)
}), {});

// create an array of arrays, repeating each array until the ticks of the next note
const result = Object.values(grouped).reduce((result, notes, i, arr) => {
    const ticks = notes[0].ticks
    const nextTicks = arr[i + 1] ? arr[i + 1][0].ticks : endTick
    const repeats = (nextTicks - ticks) / ticksPerDivision
    return [
        ...result,
        ...Array.from({length: repeats}, () => notes.map(n => n.midi))
    ] 
}, [])

const file = fs.createWriteStream(midiFile.replace('.mid', '.txt'));
file.on('error', function(err) { /* error handling */ });
file.write('[');
result.forEach(function(v, i) { file.write('[' + v.join(', ') + ']' + (i < result.length - 1 ? ',' : '')); });
file.write(']');
file.end();
