Path = require 'path'
fs = require 'fs'
express = require 'express'

# An https server, with an http server that redirects.
module.exports = (config, app)->
    config.tls.key or=
        process.env.SSL_KEY or
        Path.join global.root, 'env', 'server.key'
    config.tls.cert or=
        process.env.SSL_CERT or
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

    process.env.HTTPS_URL = "https://127.0.0.1:#{config.tls.port}/"

    httpApp = express().use (q, s, n)->
        s.redirect process.env.HTTPS_URL
    http = require('http').createServer(httpApp)

    [http, https]
