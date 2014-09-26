winston = require 'winston'
express = require 'express'
morgan = require 'morgan'

winston.config.npm.colors.http = 'magenta'
winston.config.npm.colors.data = 'grey'
winston.addColors winston.config.npm.colors

level = process.env.LOG_LEVEL or 'info'
opts = {level, colorize: yes, timestamp: yes}

winston = winston
    .remove(winston.transports.Console)
    .add(winston.transports.Console, opts)
winston.setLevels
    silly: -Infinity
    data: 100
    debug: 500
    verbose: 1000
    info: 2000
    http: 3000
    warn: 4000
    error: 5000
    silent: Infinity

stream =
    write: (message, encoding)->
        winston.http message

# logger = express.logger({stream})
logger = morgan('tiny')
module.exports = {log: winston, middleware: logger}
