// combine json files from data folder into one json file
const dirTree = require("directory-tree");
const fs = require('fs');
const tree = dirTree("./data");

function formatName(name) {
    return name
        .replace(/\s/g , '')
        .replace('-', '')
        .replace(/\.json/g, '')
        .toLowerCase()
}

function compile(array) {
    return array
        .filter(({name}) => name.includes('.json'))
        .reduce((obj, {path, name}) => {
            const data = fs.readFileSync(path)
            return {
                ...obj,
                [formatName(name)]: JSON.parse(data)
            }
        }, {})
}

const data = compile(tree.children)

const existingDataFile = fs.readFileSync('./data.json')
const existingData = JSON.parse(existingDataFile) || {}

fs.writeFile('./data.json', JSON.stringify({...existingData, ...data}), 'utf8', (err) => {
    err
        ? console.log(`Error writing data file: ${err}`)
        : console.log(`Data was parsed successfully!`);
});