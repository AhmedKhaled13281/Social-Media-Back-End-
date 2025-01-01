const winston = require('winston');

// date / level / message

const dateFormat = () => new Date(Date.now()).toLocaleString('en-GB')

class LoggerService {
    constructor(route) {
        this.route = route

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.printf(({level, message, label, timestamp , obj}) => {
                let msg = `${dateFormat()} | ${level.toUpperCase()} | ${message}`
                msg = obj ? msg + `data : ${JSON.stringify(obj)}` : msg
                return msg
            }),
            transports: [
              //new winston.transports.Console(),
              new winston.transports.File({ filename: `Logs / ${route}.log` }),
            ],
        });

    }
}

module.exports = LoggerService