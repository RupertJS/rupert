Path = require 'path'
findup = require 'findup-sync'

module.exports = (config)->
    root = []
    unless config.defaultTheme is no
        root.push config.root
    if config.themes
        for theme in config.themes
            root.push Path.resolve Path.join config.source, 'themes', theme
    delete config.root
    config.root = root

    config.vendors or=
        prefix: config.vendors?.prefix or []
        js: config.vendors?.js or []
        css: config.vendors?.css or []

    if config.framework
        require("rupert-config-#{config.framework}")(config)
        delete config.framework
    else
        cfg = config.vendors?.config or findup('package.json')
        if typeof cfg is 'string'
            cfg = require Path.resolve cfg
        deps = cfg.dependencies
        for key of deps when key.indexOf('rupert-config-') is 0
            require(key)(config)

    config.verbose = config.verbose? and config.verbose isnt no

    st = require('stassets')(config)
    st
