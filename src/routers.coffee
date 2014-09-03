glob = require 'glob'
winston = require('./logger').log
Path = require 'path'

module.exports = (config, app)->
    config.routing or= []
    unless config.stassets is false
        config.routing.unshift __dirname + '/stassets/route.coffee'
        config.routing.unshift __dirname + '/rewrite/route.coffee'
    config.routing = config.routing.concat(config.routing or [])
    config.routing.map (routePattern)->
        winston.verbose "Routers loading for '#{routePattern}'..."
        try
            files = glob.sync(routePattern).map (file)->
                './' + Path.relative __dirname, file
        catch e
            winston.error "Routers failed to find routes for '#{routePattern}'!"
            winston.debug e.stack
            files = []

        winston.silly "Routers globbing found ", files
        for file in files
            try
                winston.verbose "Routers found '#{file}'..."
                require(file)(app, config)
            catch e
                winston.error "Routers failed to load router '#{file}'!"
                winston.debug e.stack
