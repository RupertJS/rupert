restify = require 'restify'

module.exports = (config)->
  logging = require('./logger')(config)
  winston = logging.log

  app = restify()
  .use(require('./rewrite/rewriter'))
  .use(require('cookie-parser')())
  .use(require('body-parser').json())
  .use(logging.middleware)

  if process.env.NODE_ENV is 'development'
      winston.info "Starting in development mode"
      app.use require('errorhandler')({dumpExceptions: yes, showStack: yes})
      app.use (req, res, next)->
          # Let the browser know we can be promiscuous in debug info.
          res.cookie 'NODE_ENV', process.env.NODE_ENV, {maxAge: 900000}
          next()

  app
