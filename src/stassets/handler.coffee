Path = require "path"

module.exports = (config)->
    root = []
    unless config.defaultTheme is no
        root.push config.root
    if config.themes
        for theme in config.themes
            root.push Path.resolve Path.join config.source, 'themes', theme

    framework = "./vendors/#{config.framework or 'ionic'}"
    vendors = require(framework)(config.vendors or {})

    st = require('stassets')({
        root
        vendors
        verbose: config.verbose or no
    })

    st
