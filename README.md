# CT Samples
Serve samples from a local directory. Useful if you're loading samples from a browser.

## Setup
* Install dependencies
```bash
nvm use
npm install
```

## Usage
* Drag samples, or directories of samples into `samples` folder.
* run `npm run start` to compile json file of file tree and spin up local server
* `serve` message should show address of local server
* fetch `http://<address>/samples.json` from a browser script to get a list of url paths

