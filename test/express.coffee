should = require('chai').should()

Rupert = require('../src/express.js')

describe 'Rupert Express', ->
    it 'exposes a config function', ->
        Rupert.should.be.instanceof Function

    it 'should normalize config paths', ->
        config =
            root: __dirname
            stassets:
                root: './client'
            routing: [
                'server/route.coffee'
            ]

        rupert = Rupert(config)
        rupert.start ->
            config.should.have.property('wasRouted').that.equals yes
            config.stassets.root[0].should.equal "#{__dirname}/client"
