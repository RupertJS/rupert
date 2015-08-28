/// <reference path="../typings/express/express.d.ts" />

import {
  Inject,
  Rupert,
  IPlugin,
  Config,
  Logger
} from '../src/rupert';

@Inject([Logger, Config])
class MyAppHandler implements IPlugin {
  constructor(private _logger:Logger, private _config: Config) {}

  get handler() {
    return (q: Express.Request, s: Express.Response, n: (error?:any)=>void)=> {

    }
  }
}

const defaults = require('./tsconfig.json');

export const app = Rupert.createApp(defaults, MyAppHandler);

if (require.main === module) {
  app.start();
}
