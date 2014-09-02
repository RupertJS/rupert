Path = require 'path'

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
        throw new Exception 'Trying to start tls server, but no cert found!'

    https = require('https').createServer(tlsOptions, app)

    process.env.HTTPS_URL = "https://127.0.0.1:#{config.tls.port}/"
    process.env.URL = process.env.HTTPS_URL

    httpApp = express().use (q, s, n)->
        s.redirect process.env.HTTPS_URL
    http = require('http').createServer(httpApp)

    [http, https]
