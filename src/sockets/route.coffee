# WebSocketServer = require('ws').Server
socket = require 'socket.io'

sockets = (app, config)->
    app.io = socket(app.server)

module.exports = sockets
