Path = require "path"

module.exports = (config)->
    root = []
    unless config.defaultTheme is no
        root.push config.root
    if config.themes
        for theme in config.themes
            root.push Path.resolve Path.join config.source, 'themes', theme
    delete config.root
    config.root = root

    framework = "./vendors/#{config.framework or 'ionic'}"
    vendors = require(framework)(config.vendors or {})
    delete config.vendors
    config.vendors = vendors

    config.verbose = config.verbose? and config.verbose isnt no

    st = require('stassets')(config)
    st
