winston = require 'winston'
express = require 'express'
morgan = require 'morgan'

winston.config.npm.colors.http = 'magenta'
winston.config.npm.colors.data = 'grey'
winston.addColors winston.config.npm.colors
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
stream =
    write: (message, encoding)->
        winston.http message

buildLogger = (config)->
    config.log or= {}

    config.log.level = process.env.LOG_LEVEL or config.log.level or 'http'
    config.log.file = process.env.LOG_FILE or config.log.file or false
    config.log.format = process.env.LOG_FORMAT or config.log.format or 'tiny'

    opts =
        level: config.log.level
        timestamp: yes

    try
        winston.remove(winston.transports.Console)
    unless config.log.console is false
        opts.colorize = yes
        winston.add(winston.transports.Console, opts)
        delete opts.colorize

    try
        winston.remove(winston.transports.File)
    if config.log.file
        opts.filename = config.log.file
        console.log opts
        winston.add(winston.transports.File, opts)
        delete opts.filename

    logger = morgan(config.log.format, {stream})

    buildLogger.log = winston
    buildLogger.middleware = logger
    buildLogger

module.exports = buildLogger
