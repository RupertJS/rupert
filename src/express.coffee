Path = require 'path'
winston = require('./logger').log

module.exports = (config)->
    unless config
        throw new Exception "Cannot start ng-stassets without a configuration."

    # New Relic, as early as possible
    config.newRelicKey or= process.env.NEW_RELIC_KEY
    require('new-relic')(config.newRelicKey) if config.newRelicKey

    config = require('./normalize')(config)

    # Load the basic app
    app = require('./base')

    # Decide on TLS
    config.port or= process.env.HTTP_PORT or 8080
    process.env.HTTP_URL = "http://127.0.0.1:#{config.port}/"
    if config.tls
        config.tls = {} if config.tls is true
        config.tls.port or= process.env.HTTPS_PORT or 8443
        [http, https] = require('./secure')(config, app)
        app.serer = https
        process.env.URL = process.env.HTTPS_URL
    else
        app.server = http = require('./servers')(config, app)
        process.env.URL = process.env.HTTP_URL

    # Configure routing
    require('./routers')(config, app)

    # Exports
    server = null
    unsecureServer = null
    return {
        app: app
        start: (callback)->
            if config.tls
                server = https.listen config.tls.port, ->
                    winston.info "#{config.name} tls listening"
                    winston.info process.env.HTTPS_URL
                    # callback?()

            unsecureServer = http.listen config.port, ->
                winston.info "#{config.name} listening"
                winston.info process.env.HTTP_URL
                # callback?()

        stop: ->
            server?.close()
            unsecureServer?.close()
    }
