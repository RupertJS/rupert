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
                config.find('tls.port'),
                "#{name} tls",
                config.HTTPS_URL
            )) if config.tls

            readies.push startServer(
                app.servers.http,
                config.find('port'),
                name,
                config.HTTP_URL
            )

            Q.all(readies).then((->callback())).catch(callback)

        stop: (callback = ->)->
            winston.info "Stopping #{config.name}..."
            app.emit('stopping')
            app.emit('close')

            closers = listeners.map (_)->
                d = Q.defer()
                _.on 'close', ->
                    d.resolve()
                _.close()
                d.promise

            Q.all(closers).then((->callback()), callback)
    }
