glob = require 'glob'
winston = require('./logger').log
Path = require 'path'
debug = require('debug')('rupert:routers')
Q = require 'q'

module.exports = (config, app)->
    if config.find 'stassets', false
        config.prepend 'routing', "#{__dirname}/stassets/route.coffee"
        # TODO Come up with a clever way for rewriting to behave.
        # config.routing.unshift __dirname + '/rewrite/route.coffee'
    if config.find 'websockets', false
        config.prepend 'routing', "#{__dirname}/sockets/route.coffee"
    if config.find 'static', false
        config.append 'routing', "#{__dirname}/static/route.coffee"

    Q.all config.routing.map (routePattern)->
        debug "Loading for '#{routePattern}'..."
        try
            files = glob.sync(routePattern).map (file)->
                './' + Path.relative __dirname, file
        catch e
            debug "Failed to find routes for '#{routePattern}'!"
            winston.debug e.stack
            files = []

        winston.silly "Routers globbing found ", files
        Q.all files.map (file)->
            try
                debug "Found '#{file}'..."
                require(file)(app, config)
            catch e
                debug "Failed to load router '#{file}'!"
                winston.debug e.stack
                Q.reject e
    .then ->
        Q(app)
