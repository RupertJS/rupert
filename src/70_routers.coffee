glob = require 'glob'
winston = require('./logger').log
Path = require 'path'
debug = require('debug')('rupert:routers')
Q = require 'q'

module.exports = (config, app)->
    root = config.find 'root'
    # config.map 'routing', (_)-> "#{root}/#{_}"

    # TODO Come up with a clever way for rewriting to behave.
    # config.routing.unshift __dirname + '/rewrite/route.coffee'
    if config.find 'stassets', false
        config.prepend 'routing', "#{__dirname}/stassets/route.coffee"

    # Configure the server block. This is the recommended way to declare a server.
    # Using the `routing` config directly will not get a correct initialization
    # in nodemon/supervisor.
    server =
      root: config.find('server.root', 'src/server')
      extensions: config.find('server.extensions', ['js'])
      routing: config.find('server.routing', ['**/*route'])

    extensions = "{#{server.extensions.join(',')}}"
    for route in server.routing
        config.append 'routing', "#{root}/#{server.root}/#{route}.#{extensions}"

    if config.find 'websockets', false
        config.prepend 'routing', "#{__dirname}/sockets/route.coffee"
    if config.find 'static', false
        config.append 'routing', "#{__dirname}/static/route.coffee"

    debug('Full route list: ' + JSON.stringify(config.routing))

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
