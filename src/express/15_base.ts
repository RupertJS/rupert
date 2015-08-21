/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/debug/debug.d.ts" />

import * as express from 'express';
import * as _debug from 'debug';

import { Config } from '../config/Config';
// import * as _logging from '../logging/logger';

const debug = _debug('rupert:base');

export interface RupertExpress extends express.Express {
  config: Config;
  // logger: Logger;
}

export function makeApp(config: Config): express.Express {
  // const logging = _logging(config);
  // const winston = logging.log;
  // const bodyParserOpts = {
  //   limit: config.find('uploads.size', 'UPLOAD_SIZE', '100kb')
  // };

  // debug('File upload limit: ' + bodyParserOpts.limit)

  const app = <RupertExpress>express()
    // .use(cookieParser())
    // .use(bodyParser.json(bodyParserOpts))
    // .use(logging.middleware)
    // ;

  // Attach utilities for clients to access
  app.config = config;
  // app.logger = winston;

  // if process.env.NODE_ENV is 'development'
  //     winston.info "Starting in development mode"
  //     app.use require('errorhandler')({dumpExceptions: yes, showStack: yes})
  //     app.use (req, res, next)->
  //         # Let the browser know we can be promiscuous in debug info.
  //         res.cookie 'NODE_ENV', process.env.NODE_ENV, {maxAge: 900000}
  //         next()

  return app;
}
