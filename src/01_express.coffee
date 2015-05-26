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


    servers =

    # Async secion...
    # Decide on TLS
    load =
    require('./50_servers')(config, app)
    .then (app)->
        # Configure routing
        require('./70_routers')(config, app)
    .then (app)->
        listeners = []
        startServer = (server, port, name, URL)->
            try
                listeners.push listener = server.listen port
            catch err
                return Q.reject(err)

            ready = Q.defer()
            listener.on 'listening', ->
                winston.info "#{name} listening"
                winston.info URL
                ready.resolve()
            listener.on 'error', (err)->
                ready.reject err
            ready.promise

        Q {
            app: app
            start: (callback = ->)->
                readies = []
                name = config.find 'name', 'APP_NAME', 'rupert-app'
                readies.push(startServer(
                    app.servers.https,
                    config.tls.port,
                    "#{name} tls",
                    config.HTTPS_URL
                )) if config.tls

                readies.push startServer(
                    app.servers.http,
                    config.port,
                    name,
                    config.HTTP_URL
                )

                Q.all(readies).then((->callback())).catch(callback)

            stop: (callback = ->)->
                console.log "Stopping #{config.name}..."
                Q.all(listeners.map((_)->(Q.denodeify(_.close)())))
                .then((->callback())).catch(callback)
        }
    .catch (err)->
        winston.error 'Failed to start Rupert.'
        winston.error err.stack

    load.app = app
    load.config = config
    load.start = (callback)->
        load.then (_)->_.start(callback)
    load.stop = (callback)->
        load.then (_)-> _.stop().then(callback)
    load

module.exports.Stassets = constructors: require('./stassets/constructors')
module.exports.Config = Config
