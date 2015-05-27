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
    keyFile = Path.join config.root, 'env', 'server.key'
    certFile = Path.join config.root, 'env', 'server.crt'

    port = config.find 'tls.port', 'HTTPS_PORT', 8443
    keyFile = config.find 'tls.key', 'SSL_KEY', keyFile
    certFile = config.find 'tls.cert', 'SSL_CERT', certFile

    Q.all([readFile(keyFile, enc), readFile(certFile, enc)])
    .then ([key, cert])-> Q({key, cert})
    .catch (e)->
        msg = 'Trying to start tls server, but no cert found!'
        log.info msg
        log.info 'Creating 1-day temporary cert.'

        days = config.find 'tls.days', 'CERT_DAYS', 1
        pemCreateCertificate({days, selfSigned: true})
        .then (keys)->
            write =
                if config.find 'tls.writeCert', 'WRITE_CERT', false
                  log.info 'Cert generated, writing to #{keyFile}, #{certFile}.'

                  Q.all(
                      writeFile(keyFile, keys.serviceKey, enc),
                      writeFile(certFile, keys.certificate, enc)
                  )
                else
                  Q(true)
            write.then ->
                Q({key: keys.serviceKey, cert: keys.certificate})
    .then (tlsOptions)->
        https = require('https').createServer(tlsOptions, app)

        config.HTTPS_URL = "https://#{config.hostname}:#{config.tls.port}/"

        httpApp = express().use (q, s, n)->
            s.redirect config.HTTPS_URL
        require('./servers')(config, httpApp).then ({http})-> Q({http, https})
