Q = require 'q'
fs = require 'fs'
Path = require 'path'
express = require 'express'
readFile = Q.denodeify fs.readFile
writeFile = Q.denodeify fs.writeFile
log = require('./logger').log
pem = require 'pem'
pemCreateCertificate = Q.denodeify pem.createCertificate
enc = {encoding: 'utf-8'}

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

    Q.all([readFile(config.tls.key, enc), readFile(config.tls.cert, enc)])
    .then ([key, cert])-> Q({key, cert})
    .catch (e)->
        msg = 'Trying to start tls server, but no cert found!'
        log.info msg
        log.info 'Creating 1-day temporary cert.'

        config.tls.days =
            process.env.CERT_DAYS or
            config.tls.days or
            1

        pemCreateCertificate({days: config.tls.days, selfSigned: true})
        .then (keys)->
            (if config.tls.writeCert is true
                log.info 'Cert generated, writing to #{keyFile}, #{crtFile}.'

                Q.all(
                    writeFile(config.tls.key, keys.serviceKey, enc),
                    writeFile(config.tls.cert, keys.certificate, enc)
                )
            else
                Q(true)
            ).then ->
                Q({key: keys.serviceKey, cert: keys.certificate})
    .then (tlsOptions)->
        https = require('https').createServer(tlsOptions, app)

        config.HTTPS_URL = "https://#{config.hostname}:#{config.tls.port}/"

        httpApp = express().use (q, s, n)->
            s.redirect config.HTTPS_URL
        require('./servers')(config, httpApp).then ({http})-> Q({http, https})
