rewriter = require './rewriter'
module.exports = (app, config)->
    app.get(/^.*\/index.m(?:d|arkdown)$/, rewriter.rewrite('/'))
    app.get(/^\/.+\/$/, rewriter.rewrite('/'))
