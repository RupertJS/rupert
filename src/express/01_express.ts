// Path = require 'path'
// debug = require('debug')('rupert')
import { Config, ConfigObj } from '../config/config';

import { normalize as NormalizeConfiguration } from './10_normalize';

export type RupertServer = {
  config: Config;
}

export default function(configuration: ConfigObj = {}): RupertServer {
  const config = new Config(configuration);

  NormalizeConfiguration(config);
//     # Load the basic app
//     app = require('./15_base')(config)
//     # There is a hidden dependency:
//     # The logger is configured statically in 15_base.
//     winston = require('./logger').log

//     # Load plugins. These are third-party pieces, not app routes.
//     # See 70_routers for that.
//     require('./20_plugins')(config)

//     # Async section
//     load =
//     require('./50_servers')(config, app)
//     .then (app)->
//         # Attach utilities for clients to access
//         app.config = config
//         app.logger = winston
//         app
//     .then (app)->
//         # Configure routing
//         require('./70_routers')(config, app)
//     .then (app)->
//         require('./59_start')(config, app)
//     .catch (err)->
//         winston.error 'Failed to start Rupert.'
//         winston.error err.stack

//     load.app = app
//     load.config = config
//     load.start = (callback)->
//         load.then (_)->
//           load.starter = _
//           _.start(callback)
//     load.stop = (callback)->
//         if load.starter and load.starter.stop
//             load.starter.stop().then(callback)
//     load

  return {
    config
  };
}
