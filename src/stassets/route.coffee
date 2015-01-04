route = (app, config)->
    app.stassets = require("./handler")(config)
    app.use(app.stassets)

module.exports = route
