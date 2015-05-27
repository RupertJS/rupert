express = require 'express'
debug = require('debug')('rupert:base')

module.exports = (config)->
  logging = require('./logger')(config)
  winston = logging.log

  bodyParser = {limit: config.find('uploads.size', 'UPLOAD_SIZE', '100kb')}

  debug('File upload limit: ' + bodyParser.limit)

  app = express()
  .use(require('./rewrite/rewriter'))
  .use(require('cookie-parser')())
  .use(require('body-parser').json(bodyParser))
  .use(logging.middleware)

  # Attach utilities for clients to access
  app.config = config
  app.logger = winston

  if process.env.NODE_ENV is 'development'
      winston.info "Starting in development mode"
      app.use require('errorhandler')({dumpExceptions: yes, showStack: yes})
      app.use (req, res, next)->
          # Let the browser know we can be promiscuous in debug info.
          res.cookie 'NODE_ENV', process.env.NODE_ENV, {maxAge: 900000}
          next()

  app
