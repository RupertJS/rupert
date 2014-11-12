Q = require 'q'
Path = require 'path'
winston = require('./logger').log

module.exports = (config)->
    unless config
        throw new Error "Cannot start rupert without a configuration."

    # New Relic, as early as possible
    config.newRelicKey = process.env.NEW_RELIC_KEY or config.newRelicKey
    require('new-relic')(config.newRelicKey) if config.newRelicKey

    config = require('./normalize')(config)

    # Load the basic app
    app = require('./base')
    servers = {}

    # Async secion...
    # Decide on TLS
    load = (do ->
        if config.tls
            config.tls = {} if config.tls is true
            require('./secure')(config, app)
            .then (_)->
                servers = _
                app.server = servers.https
                process.env.URL = config.HTTPS_URL
                app
        else
            require('./servers')(config, app)
            .then (_)->
                servers = _
                app.server = servers.http
                process.env.URL = config.HTTP_URL
                app
    ).then (app)->
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
                    confif.HTTPS_URL
                )) if config.tls

                readies.push startServer(
                    servers.http,
                    config.port,
                    config.name,
                    config.HTTP_URL
                )

                Q.all(readies.map((_)->_.promise))
                .then((->callback())).catch(callback);

            stop: ->
                listeners.map (_)->_.close()
        }
    .catch (err)->
        winston.error 'Failed to start Rupert.'
        winston.error err.stack

    load.app = app
    load.start = (callback)->
        load.then((_)->_.start(callback))
    load.stop = ->
        load.then((_)->_.stop(callback))
    load
