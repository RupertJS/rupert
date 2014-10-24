Path = require 'path'
debug = require('debug')('rupert:static')
st = require 'st'
module.exports = (app, config)->
    for url, path of (config.static or {})
        path = Path.relative process.cwd(), path
        debug "Serving #{path} at #{url}"
        app.use st({url, path, index: yes})
