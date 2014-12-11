Path = require 'path'
findup = require 'findup-sync'
logger = require('../logger').log

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

    # quick and dirty check if a dependency is requireable
    canRequire = (key)->
        key.indexOf('rupert-config-') is 0 or key.indexOf('/') > -1

    if config.framework
        require("rupert-config-#{config.framework}")(config)
        delete config.framework
    else
        cfg = config.vendors?.config or findup('package.json')
        if typeof cfg is 'string'
            cfg = require Path.resolve cfg
        deps = cfg.dependencies
        for key of deps when canRequire key
            dep =
                try
                    require(key)
                catch e
                    # We might be in an awkward position. Given a common known
                    # path we can assume the module that loaded rupert is at:
                    base = module.parent.parent.parent.parent.parent.filename
                    try
                        require(Path.join(
                          Path.dirname(base), 'node_modules', key
                        ))
                    catch err
                        logger.warn "Could not find config #{key}"
                        logger.info err, err.stack
                        (->)
            dep(config)

    config.verbose = config.verbose? and config.verbose isnt no
    st = require('stassets')(config)
    st
