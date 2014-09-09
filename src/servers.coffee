module.exports = (config, app)->
    config.port or= process.env.HTTP_PORT or 8080
    config.URL = config.HTTP_URL = "http://127.0.0.1:#{config.port}/"
    http = require('http').createServer(app)
    http
