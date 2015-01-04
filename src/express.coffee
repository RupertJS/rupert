Q = require 'q'
Path = require 'path'
debug = require('debug')('rupert')
Config = require('./config')

module.exports = (config)->
    unless config
        throw new Error "Cannot start rupert without a configuration."

    config = new Config config

    # New Relic, as early as possible
    # newRelicKey = config.find 'newRelicKey', 'NEW_RELIC_KEY', null
    # require('new-relic')(newRelicKey) if newRelicKey?

    config = require('./normalize')(config)
    # Load the basic app
    app = require('./base')(config)
    # Load plugins
    require('./plugins')(config)
    winston = require('./logger').log
    servers = {}

    # Async secion...
    # Decide on TLS
    load = (do ->
        if tls = config.find 'tls', 'TLS', false
            config.set('tls', {}) if tls is true
            require('./secure')(config, app)
            .then (_)->
                servers = _
                app.server = servers.https
                app.url = process.env.URL = config.HTTPS_URL
                app
        else
            require('./servers')(config, app)
            .then (_)->
                servers = _
                app.server = servers.http
                app.url = process.env.URL = config.HTTP_URL
                app
    )
    .then (app)->
        # Configure routing
        require('./routers')(config, app)
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

                readies.push(startServer(
                    servers.https,
                    config.tls.port,
                    "#{config.name} tls",
                    config.HTTPS_URL
                )) if config.tls

                readies.push startServer(
                    servers.http,
                    config.port,
                    config.name,
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

module.exports.Stassets =
    constructors: require('./stassets/constructors')
