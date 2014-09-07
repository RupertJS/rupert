glob = require 'glob'
winston = require('./logger').log
Path = require 'path'
debug = require('debug')('ng-stassets:routers')

module.exports = (config, app)->
    config.routing or= []
    unless config.stassets is false
        config.routing.unshift __dirname + '/stassets/route.coffee'
        config.routing.unshift __dirname + '/rewrite/route.coffee'
    unless config.websockets is false
        config.routing.unshift __dirname + '/sockets/route.coffee'
    config.routing.map (routePattern)->
        debug "Loading for '#{routePattern}'..."
        try
            files = glob.sync(routePattern).map (file)->
                './' + Path.relative __dirname, file
        catch e
            debug "Failed to find routes for '#{routePattern}'!"
            winston.debug e.stack
            files = []

        winston.silly "Routers globbing found ", files
        for file in files
            try
                debug "Found '#{file}'..."
                require(file)(app, config)
            catch e
                debug "Failed to load router '#{file}'!"
                winston.debug e.stack
