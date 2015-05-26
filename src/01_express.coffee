Q = require 'q'
Path = require 'path'
debug = require('debug')('rupert')
Config = require('./config')

module.exports = (config = {})->
    config = new Config config

    require('./10_normalize')(config)
    # Load the basic app
    app = require('./15_base')(config)
    # Load plugins
    require('./20_plugins')(config)
    winston = require('./logger').log
    servers = {}

    # Async secion...
    # Decide on TLS
    load = (do ->
        if tls = config.find 'tls', 'TLS', false
            debug("Configuring TLS")
            config.set('tls', {}) if tls is true
            require('./51_secure')(config, app)
            .then (_)->
                servers = _
                app.server = servers.https
                app.url = process.env.URL = config.HTTPS_URL
                app
        else
            debug("No TLS")
            require('./50_servers')(config, app)
            .then (_)->
                servers = _
                app.server = servers.http
                app.url = process.env.URL = config.HTTP_URL
                app
    )
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
                    servers.https,
                    config.tls.port,
                    "#{name} tls",
                    config.HTTPS_URL
                )) if config.tls

                readies.push startServer(
                    servers.http,
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
