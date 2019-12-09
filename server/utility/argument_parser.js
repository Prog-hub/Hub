

function parseArgs(params) {
    
}

function getEnvArg(args) {
    const configArg = args[2]; 
    let configKey;
    if(configArg) {
        const prodPattern = /prod$/g
        const testPattern = /test$/g
        const debugPattern = /debug$/g
        if(prodPattern.test(configArg)){
            return 'prod';
        } else if (testPattern.test(configArg)) {
            return 'test';
        } else if(debugPattern.test(configArg)) {
            return 'debug';
        } else {
            throw new Error('Please specify the database environment example: node app.js -prod'); 
        }
    }
}

function shouldWipe(args) {
    const pattern = /^-test$/g;
    const isTest = pattern.test(args[2]);
    const wipeCommand = args.some(arg => arg == '-wipe');
    return isTest || wipeCommand;
}

module.exports = {parseArgs, getEnvArg, shouldWipe}