should = require "should"
global.root = require('path').join('.')
app = require('express')()

# TODO This depends on a successful build
app
.use(require('./rewriter'))
require('./route')(app)
app.use(require('../stassets/handler'))
request = require('supertest')(app)

describe.only "Server", ->
    describe "html5", ->
        it "returns index on any request to non-asset.", (done)->
            request.get('/deep/link/')
            .expect(200)
            .expect('content-type', /text\/html/)
            .end done
