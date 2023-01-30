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
    1. Go to `chrome://extensions/`
    2. Enable `developer mode`
    3. Click on `load unpacked extension`
    4. Select the `build` folder