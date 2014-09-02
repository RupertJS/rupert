st = require 'st'
Path = require 'path'

route = (config, app)->
    app.use(require("./handler")(config.stassets or {}))

    ionic = Path.join global.root, 'bower_components', 'ionic', 'release'
    fonts = Path.join(ionic, 'fonts')

    app.use(st({path: fonts, url: '/fonts'}))


module.exports = route
