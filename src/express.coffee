Q = require 'q'
Path = require 'path'
winston = require('./logger').log

module.exports = (config)->
    unless config
        throw new Exception "Cannot start ng-stassets without a configuration."

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
            start: (callback)->
                if config.tls
                    server = servers.https.listen config.tls.port, ->
                        winston.info "#{config.name} tls listening"
                        winston.info config.HTTPS_URL
                        # callback?()

                unsecureServer = servers.http.listen config.port, ->
                    winston.info "#{config.name} listening"
                    winston.info config.HTTP_URL
                    # callback?()

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
