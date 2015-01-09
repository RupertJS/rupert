Path = require 'path'

module.exports = (config)->
    stroot = config.find 'stassets.root', []
    if stroot.length is 0
        config.append 'stassets.root', config.find 'root'

    if themes = config.find 'stassets.themes'
        for theme in themes
            themePath = Path.resolve Path.join config.source, 'themes', theme
            config.append 'stassets.root', themePath

    config.find 'stassets.vendors.prefix', []
    config.find 'stassets.vendors.js', []
    config.find 'stassets.vendors.css', []

    config.find 'stassets.verbose', 'VERBOSE', no
    st = require('stassets')(config.stassets)
    st
