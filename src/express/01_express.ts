// Path = require 'path'
// debug = require('debug')('rupert')
import { Config, ConfigObj } from '../config/config';

import { normalize as NormalizeConfiguration } from './10_normalize';
import { makeApp, RupertExpress } from './15_base';

export type RupertServer = {
  config: Config;
}

export default function(configuration: ConfigObj = {}): RupertServer {
  const config = new Config(configuration);

  NormalizeConfiguration(config);

  // Load the basic app
  const app = makeApp(config);

//     # Load plugins. These are third-party pieces, not app routes.
//     # See 70_routers for that.
//     require('./20_plugins')(config)

//     # Async section
//     load =
//     require('./50_servers')(app)
//     .then (app)->
//         # Configure routing
//         require('./70_routers')(config, app)
//     .then (app)->
//         require('./59_start')(config, app)
//     .catch (err)->
//         app.logger.error 'Failed to start Rupert.'
//         app.logger.error err.stack

//     load.app = app
//     load.config = config
//     load.start = (callback)->
//         load.then (_)->
//           load.starter = _
//           _.start(callback)
//     load.stop = (callback)->
//         if load.starter and load.starter.stop
//             load.starter.stop().then(callback)

  return {
    config
  };
}
