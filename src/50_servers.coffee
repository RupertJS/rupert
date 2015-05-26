Q = require('q')
module.exports = (config, app)->
    port = config.find 'port', 'HTTP_PORT', 8080
    config.URL = config.HTTP_URL = "http://#{config.hostname}:#{config.port}/"
    http = require('http').createServer(app)
    Q {http}
