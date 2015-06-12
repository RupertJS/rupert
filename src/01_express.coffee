Q = require 'q'
Path = require 'path'
debug = require('debug')('rupert')
Config = require('./config')

module.exports = (config = {})->
    config = new Config config

    require('./10_normalize')(config)
    # Load the basic app
    app = require('./15_base')(config)
    # There is a hidden dependency:
    # The logger is configured statically in 15_base.
    winston = require('./logger').log

    # Load plugins. These are third-party pieces, not app routes.
    # See 70_routers for that.
    require('./20_plugins')(config)

    # Async section
    load =
    require('./50_servers')(config, app)
    .tap (app)-> require('./70_routers')(config, app)
    .then (app)-> return require('./59_start')(config, app)
    .catch (err)->
        winston.error 'Failed to start Rupert.'
        winston.error err.stack

    load.app = app
    load.config = config
    load.start = (callback)->
        load.then (_)->
          load.starter = _
          _.start(callback)
    load.stop = (callback)->
        if load.starter and load.starter.stop
            load.starter.stop().then(callback)
    load

module.exports.Stassets = constructors: require('./stassets/constructors')
module.exports.Config = Config
