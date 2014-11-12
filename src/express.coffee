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
        # Exports
        server = null
        unsecureServer = null
        Q {
            app: app
            start: (callback = ->)->
                readies = []
                if config.tls
                    readies.push(tlsReady = Q.defer())
                    try
                        secureServer = servers.https.listen config.tls.port
                    catch err
                        ready.reject(err)

                    secureServer.on 'listening', ->
                        winston.info "#{config.name} tls listening"
                        winston.info config.HTTPS_URL
                        tlsReady.resolve()
                    secureServer.on 'error', (err)->
                        tlsReady.reject(err)
                        false

                readies.push(ready = Q.defer())
                try
                    unsecureServer = servers.http.listen config.port
                catch err
                    ready.reject(err)
                unsecureServer.on 'listening', ->
                    winston.info "#{config.name} listening"
                    winston.info config.HTTP_URL
                    ready.resolve()
                unsecureServer.on 'error', (err)->
                    ready.reject(err)
                    false

                Q.all(readies.map((_)->_.promise))
                .then((->callback()), callback);

            stop: ->
                server?.close()
                unsecureServer?.close()
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
