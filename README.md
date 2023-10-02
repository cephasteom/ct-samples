# CT Samples
Serve samples from a local directory. Useful if you're loading samples from a browser.

## Setup
* Install dependencies
```bash
nvm use
npm install
```

## Usage
* Drag folders of samples into `samples` folder. The file structure should look something like this:
├── samples
│   ├── bd
│   │   ├── *.wav
│   ├── sd
│   │   ├── *.wav
│   ├── pads
│   │   ├── *.wav
N.B. browsers don't like .aif or .aiff files.
* run `npm run start` to compile json file of file tree and spin up local server
* `serve` message should show address of local server
* fetch `http://<address>/samples.json` from a browser script to get a list of url paths, grouped by directory

