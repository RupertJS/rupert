Path = require 'path'

module.exports = (config)->
    root = config.find 'root',
        unless typeof global.root is 'string'
            process.cwd()
        else
            global.root

    config.find 'hostname', 'HOST', require('os').hostname()

    normRoot = (_)-> Path.normalize Path.join root, _
    config.find 'stassets.root', 'STASSETS_ROOT', config.stassets.root or '.'
    config.map 'stassets.root', normRoot
    config.map 'stassets.vendors.prefix', normRoot

    config.set 'stassets.static', config.find 'static', false

    config
