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

    # Decide on TLS
    if config.tls
        config.tls = {} if config.tls is true
        [http, https] = require('./secure')(config, app)
        app.server = https
        process.env.URL = config.HTTPS_URL
    else
        app.server = http = require('./servers')(config, app)
        process.env.URL = config.HTTP_URL

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
                    winston.info config.HTTPS_URL
                    # callback?()

            unsecureServer = http.listen config.port, ->
                winston.info "#{config.name} listening"
                winston.info config.HTTP_URL
                # callback?()

        stop: ->
            server?.close()
            unsecureServer?.close()
    }
