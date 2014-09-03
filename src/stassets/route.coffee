st = require 'st'
Path = require 'path'

route = (config, app)->
    app.use(require("./handler")(config.stassets or {}))

    ionic = Path.resolve __dirname, '../../../node_modules/ionic/release'
    fonts = Path.join(ionic, 'fonts')

    app.use(st({path: fonts, url: '/fonts'}))


module.exports = route
