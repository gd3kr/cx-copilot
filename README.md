### Quickstart

Go to extension directory.
```
$ cd ./client/chrome-extension/
```

Download dependencies and perform initial project setup.
```
$ yarn
```

Edit configuration inside `src/utils/config.js`.
```
const config = {};
config.API_URL = 'http://localhost:9000';
export default config;
```

Run the project.
```
$ yarn start
```
