/// <reference path="../../typings/express/express.d.ts" />

import * as express from 'express';

import {
  Inject,
  Injector,
  bind
} from '../di/di';

import {
  Config,
  ConfigValue
} from '../config/config';

import {
  ILogger,
  Logger
} from '../logger/logger';

export class Rupert {
  private _app: express.Application;
  private _environment: String;

  constructor(
    // @Inject(Injector) private _injector: Injector,
    @Inject(Config) private _config: Config,
    @Inject(ILogger) private _logger: ILogger
  ) {
    this._environment = this.config.find(
      'environment', 'NODE_ENV', 'development'
    );

    const maxUpload = this.config.find('uploads.size', 'UPLOAD_SIZE', '100kb');
    this.logger.debug(`Max upload size: ${maxUpload}`);

    this._app = express()
      .use(require('cookie-parser')())
      .use(require('body-parser').json({ limit: maxUpload }))
      .use(this.logger.middleware)
      ;

    if (this.environment === 'development') {
      this.app.use(require('errorhandler')({
        dumpExceptions: true, showStack: true
      }));
      this.app.use((
        req: express.Request,
        res: express.Response,
        next: Function
      ) => {
        // Let the browser know we can be promiscuous in debug info.
        res.cookie('NODE_ENV', this.environment, {maxAge: 900000});
        next();
      });
    }
  }

  // _servers() {

  // }

  // _secureServer() {

  // }

  // _unsecureServer() {

  // }

  get logger(): ILogger { return this._logger; }
  get config(): Config { return this._config; }
  get environment(): String { return this._environment; }
  get app(): express.Application { return this._app; }

  static createApp(config: ConfigValue): Rupert {
    const injector = Injector.create([
      // bind(Injector).toFactory(() => injector),
      bind(Config).toFactory(() => new Config(config, process.argv)),
      bind(ILogger).toClass(Logger),
      bind(Rupert).toClass(Rupert)
    ]);

    return <Rupert>injector.get(Rupert);
  }
}
