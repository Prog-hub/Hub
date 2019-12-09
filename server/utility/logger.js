class Logger {
    static debug(...data) {
        if (process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'prod') {
            return false
        }
        console.log(...data)
    }

    static info(...data) {
        console.log(...data)
    }

    static error(...data) {
        if (process.env.NODE_ENV == 'test') { return false; }
        console.error(...data)
    }

}

module.exports = Logger