Path = require 'path'
fs = require 'fs'
express = require 'express'

# An https server, with an http server that redirects.
module.exports = (config, app)->
    config.tls.port =
        process.env.HTTPS_PORT or
        config.tls.port or
        8443
    config.tls.key =
        process.env.SSL_KEY or
        config.tls.key or
        Path.join global.root, 'env', 'server.key'
    config.tls.cert =
        process.env.SSL_CERT or
        config.tls.cert or
        Path.join global.root, 'env', 'server.crt'

    try
        tlsOptions =
            key: fs.readFileSync(config.tls.key, 'utf-8')
            cert: fs.readFileSync(config.tls.cert, 'utf-8')
    catch e
        err = new Error 'Trying to start tls server, but no cert found!'
        err.original = e
        throw e

    https = require('https').createServer(tlsOptions, app)

    config.HTTPS_URL = "https://#{config.hostname}:#{config.tls.port}/"

    httpApp = express().use (q, s, n)->
        s.redirect config.HTTPS_URL
    http = require('./servers')(config, httpApp)

    [http, https]
