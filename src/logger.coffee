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
    level = config.find 'log.level', 'LOG_LEVEL', 'http'
    format = config.find 'log.format', 'LOG_FORMAT', 'tiny'
    file = config.find 'log.file', 'LOG_FILE', false
    # HACK
    if file is 'false'
        config.set 'log.file', false
        file = false

    opts = {level, timestamp: yes}
    try
        winston.remove(winston.transports.Console)
    unless config.log.console is false
        opts.colorize = yes
        winston.add(winston.transports.Console, opts)
        delete opts.colorize

    try
        winston.remove(winston.transports.File)
    if file isnt false
        opts.filename = file
        winston.add(winston.transports.File, opts)
        delete opts.filename

    logger = morgan(format, {stream})

    buildLogger.log = winston
    buildLogger.middleware = logger
    buildLogger

module.exports = buildLogger
