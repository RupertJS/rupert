Q = require('q')
module.exports = (config, app)->
    config.port = process.env.HTTP_PORT or config.port or 8080
    config.URL = config.HTTP_URL = "http://#{config.hostname}:#{config.port}/"
    http = require('http').createServer(app)
    Q http
