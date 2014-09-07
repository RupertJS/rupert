st = require 'st'
Path = require 'path'
debug = require('debug')('ng-stassets:stassets')

route = (app, config)->
    debugger
    app.use(require("./handler")(config.stassets or {}))
    ionic = Path.resolve __dirname, '../../node_modules/ionic/release'
    fonts = Path.join(ionic, 'fonts')

    debug "Serving fonts from #{fonts}"
    app.use(st({path: fonts, url: '/fonts'}))

module.exports = route
