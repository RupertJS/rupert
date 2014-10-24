st = require 'st'
Path = require 'path'
debug = require('debug')('ng-stassets:stassets')

route = (app, config)->
    app.stassets = require("./handler")(config.stassets or {})
    app.use(app.stassets)

module.exports = route
