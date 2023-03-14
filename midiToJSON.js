const { Midi } = require('@tonejs/midi')
const dirTree = require("directory-tree");
const fs = require('fs');
const tree = dirTree("./midi");

function formatName(name) {
    return name
        .replace(/\s/g , '')
        .replace('-', '')
        .replace(/\.mid/g, '')
        .toLowerCase()
}

function parseMidi(files) {
    return files
        .filter(file => file.name.includes('.mid'))
        .reduce((obj, {path, name}) => {
            const midiData = fs.readFileSync(path)
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
            return {
                ...obj,
                [formatName(name)]: Object.values(grouped).reduce((result, notes, i, arr) => {
                    const ticks = notes[0].ticks
                    const nextTicks = arr[i + 1] ? arr[i + 1][0].ticks : endTick
                    const repeats = (nextTicks - ticks) / ticksPerDivision
                    return [
                        ...result,
                        ...Array.from({length: repeats}, () => notes.map(n => n.midi))
                    ] 
                }, [])
            }
        }, {})
}

function compile(array) {
    return array
        .reduce((obj, {path, name, children}) => {
            return children
                ? {
                    ...obj,
                    [formatName(name)]: parseMidi(children)
                }
                :
                obj
        }, {})
}

const data = compile(tree.children)
const json = JSON.stringify(data);

fs.writeFile('./data.json', json, 'utf8', (err) => {
    err
        ? console.log(`Error writing data file: ${err}`)
        : console.log(`Data file is written successfully!`);
});
