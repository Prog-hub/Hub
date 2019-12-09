# PROGRAMMERS HUB CLIENT

## Installation:
```bash
$ npm install
```
```bash
$ npm install -g flow-bin
```
```bash
$ npm install -g webpack
```


## Start
------
### Server
```bash
$ node_modules/.bin/webpack-dev-server
```

### Static files
* DO NOT RUN THE FOLLOWING COMMANDS AS SUDO

#### Production
* Alt1: `$ ./node_modules/webpack/bin/webpack.js --config webpack.config.js`
* Alt2: `$ webpack`

### Development
* Alt1: `$ npm run build:dev`
* Alt2: `$ ./node_modules/webpack/bin/webpack.js --config webpack.config.js --mode development`

## Issues
------
### To fix vscode issues with types in js file that uses Flow
* install flow in your extensions
* remove default extension for TS, => Packages search => `@builtin TypeScript and JavaScript Language Features`



### To fix flow lib types:
* define the stub in type-def-libs
* remove `.*/node_modules/` from [ignore] line 

### To run the tests
* change to the proper config in `networkconfig.js` in the network folder usually ['test'].
* change to the proper ip in Makefile usually `127.0.0.1`.
* Run `make selenium` on the server.


### To fix node-sass:
```bash
sudo npm install --unsafe-perm node-sass
```
### CSS
* Du får inte ha streck i css klassnamn för att deb blir conflict med react.

## Tips
------
### Cheat sheets
https://react-hooks-cheatsheet.com/usereducer<br/>
http://grid.malven.co/<br/>
