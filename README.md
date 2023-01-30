## Quickstart

1. Go to extension directory.
```
$ cd ./client/chrome-extension/
```

2. Download dependencies and perform initial project setup.
```
$ yarn
```

3. Edit configuration inside `src/utils/config.js`.
```
const config = {};
config.API_URL = 'http://localhost:9000';
export default config;
```

4. Run the project.
```
$ yarn start
```

5. Load your extension on Chrome by doing the following:
    i. Go to `chrome://extensions/`
    ii. Enable `developer mode`
    iii. Click on `load unpacked extension`
    iv. Select the `build` folder