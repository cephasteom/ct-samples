# CT Samples
Serve samples from a local directory. Useful if you're loading samples from a browser.

## Setup
* Install dependencies
```bash
nvm use
yarn
```

## Usage
* Drag samples, or directories of samples into `samples` folder.
* run `yarn start` to compile json file of file tree and spin up local server
* fetch `http://localhost:5000/samples.json` from a browser script to get list of url paths 

