module.exports = (config, app)->
    http = require('http').createServer(app)
    process.env.URL = process.env.HTTP_URL
    http
