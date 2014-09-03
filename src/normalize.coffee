Path = require 'path'

module.exports = (config)->
    if config.stassets?.root?
        config.stassets.root =
            Path.normalize Path.join global.root, config.stassets.root
    if config.stassets?.vendors?.prefix?
        config.stassets.vendors.prefix =
        config.stassets.vendors.prefix.map (_)->
            Path.normalize Path.join global.root, _
    if config.routing?
        config.routing = config.routing.map (route)->
            "#{global.root}/#{route}"
    config
