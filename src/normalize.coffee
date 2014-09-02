Path = require 'path'

module.exports = (config)->
    if config.stassets?.root?
        config.stassets.root =
            Path.normalize Path.join global.root, config.stassets.root
    if config.routing?
        config.routing = config.routing.map (route)->
            "#{global.root}/#{route}"
    config
