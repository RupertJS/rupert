Q = require('q')
debug = require('debug')('rupert:start')

module.exports = (config, app)->
    winston = require('./logger').log
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
