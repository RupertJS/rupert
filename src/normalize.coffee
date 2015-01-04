Path = require 'path'

module.exports = (config)->
    root = config.find('root', global.root or process.cwd())
    unless typeof root is 'string'
        root = config.set 'root', process.cwd()

    config.find 'hostname', 'HOST', require('os').hostname()

    normRoot = (_)-> Path.normalize Path.join root, _
    config.find 'stassets.root', 'STASSETS_ROOT', config.stassets.root or '.'
    config.map 'stassets.root', normRoot
    config.map 'stassets.vendors.prefix', normRoot
    config.map 'routing', (_)-> "#{root}/#{_}"

    config.set 'stassets.static', config.find 'static', false

    config
