winston = require 'winston'
express = require 'express'
morgan = require 'morgan'

winston.config.npm.colors.http = 'magenta'
winston.config.npm.colors.data = 'grey'
winston.addColors winston.config.npm.colors

buildLogger = (config)->
    config.log or= {}

    level = process.env.LOG_LEVEL or config.log.level or 'http'
    opts = {level, colorize: yes, timestamp: yes}

    winston.setLevels
        silly: -Infinity
        data: 100
        debug: 500
        verbose: 1000
        http: 2000
        info: 3000
        warn: 4000
        error: 5000
        silent: Infinity
    winston.level = level

    stream =
        write: (message, encoding)->
            winston.http message

    format = process.env.LOG_FORMAT or config.log.format or 'tiny'
    logger = morgan(format, {stream})

    buildLogger.log = winston
    buildLogger.middleware = logger
    buildLogger

module.exports = buildLogger
