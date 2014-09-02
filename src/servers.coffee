module.exports = (config, app)->
    http = require('http').createServer(app)
    process.env.HTTP_URL = "http://127.0.0.1:#{config.port}/"
    process.env.URL = process.env.HTTP_URL
    http
