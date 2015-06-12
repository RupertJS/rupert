should = require('chai').should()

server =
    root: __dirname
    name: 'rupert.tests'
    plugins:
        dependencies: {}
    stassets:
        root: './client'
    routing: [
        __dirname + '/server/route.coffee'
    ]
    server:
      root: 'backend'
      extensions: [
        'js'
        'coffee'
      ],
      routing: [
        'route'
      ]

Rupert = require('../express.js')
lib = __dirname + "/rupert-config"
server.plugins.dependencies[lib] = yes

unless describe?
    Rupert(server).start()
else
    describe 'Rupert Express', ->
        rupert = Rupert(server)
        config = rupert.config
        beforeEach (done)-> rupert.then -> done()

        it 'exposes a config function', ->
            Rupert.should.be.instanceof Function

        it 'should normalize config paths', ->
            config.should.have.property('wasRouted').that.equals yes
            config.should.have.property('backendRouted').that.equals yes
            stassetsRoot = config.find 'stassets.root'
            stassetsRoot.should.be.instanceof Array
            stassetsRoot[0].should.equal "#{__dirname}/client"

        describe 'Stassets', ->
            it 'loads configurations', ->
                types = config.find 'stassets.scripts.types'
                types.length.should.equal(2)

            it 'exposes constructors', ->
                Object.keys(Rupert.Stassets.constructors).length.should.equal 8

    # describe 'Rupert Express Error Handling', ->
    #     it 'does callback with exceptions', (done)->
    #         config =
    #             root: __dirname
    #             name: 'rupert.tests'
    #             port: 80
    #             stassets: false
    #         rupert = Rupert config
    #         rupert.start (err)->
    #             should.exist err
    #             rupert.stop()#.then(done)

    describe 'Rupert secure server', ->
        it 'starts a secure server', (done)->
            config = JSON.parse(JSON.stringify(server))
            config.tls = true
            delete process.env.TLS
            rupert = Rupert config
            rupert.start (err)->
                return done(err) if err
                rupert.config.find('tls.port').should.equal '8443'
                rupert.stop done
