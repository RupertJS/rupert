/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />

import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import { EventEmitter } from 'events';

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

type RupertReady = {
  server: http.Server|https.Server,
  port: number,
  name: string,
  url: string
};

export class Rupert extends EventEmitter {
  private _app: express.Application;
  private _environment: String;
  private _listeners: EventEmitter[] = [];

  public root: string = typeof global.root === 'string' ?
      <string><any>global.root :
      process.cwd() ;
  public url: string;
  public name: string;
  public servers: {http: http.Server, https?: https.Server};

  constructor(
    // @Inject(Injector) private _injector: Injector,
    @Inject(Config) private _config: Config,
    @Inject(ILogger) private _logger: ILogger
  ) {
    super();

    this._normalize();

    this.name = this.config.find('name', 'APP_NAME', 'rupert-app');

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

    this._configureServers();
  }

  public start(): Promise<Rupert> {
    let readies: any[] = [];

    // if (this.servers.https) {
    //   readies.push(
    //     this.startServer(
    //       this.servers.https,
    //       this.config.find<number>('tls.port'),
    //       `${this.name} tls`,
    //       this.config.find<string>('HTTPS_URL')
    //     )
    //   );
    // }

    readies.push(this._startServer(
      this.servers.http,
      this.config.find<number>('port'),
      this.name,
      this.config.find<string>('HTTP_URL')
    ));

    return Promise.all(readies).then(() => this);
  }

  private _startServer(
    server: http.Server|https.Server,
    port: number,
    name: string,
    url: string
  ): Promise<Rupert> {
    return new Promise((resolve: Function, reject: Function) => {
      let listener: EventEmitter = null;
      try {
        listener = <EventEmitter>(<any>server).listen(port);
        this._listeners.push(listener);
      } catch (err) {
        return reject(err);
      }

      listener.on('listening', () => {
        this.logger.info(`${name} listening`);
        this.logger.info(url);
        resolve();
      });
      listener.on('error', (err: any) => {
        reject(err);
      });
    });
  }

  public stop(): Promise<Rupert> {
    this.logger.info(`Stopping #{this.name}...`);
    this.emit('stopping');
    this.emit('close');

    let closers = this._listeners.map((_: EventEmitter) => {
      return new Promise((resolve: Function, reject: Function) => {
        _.on('close', () => {
          resolve();
        });
        (<any>_).close();
      });
    });

    return Promise.all(closers).then(() => this);
  }

  private _normalize() {
    this.root = this.config.find('root', this.root);
    this.config.find('hostname', 'HOST', require('os').hostname());
  }

  private _configureServers() {
    const tls = this.config.find('tls', 'TLS', false);
    if (tls !== false) {
      this._secureServer();
    } else {
      this._unsecureServer();
    }
    process.env.URL = this.url;
  }

  private _secureServer() {
    const port = this.config.find('tls.port', 'HTTPS_PORT', 8443);
    console.log(port);
  }

  private _unsecureServer() {
    const port = this.config.find('port', 'HTTP_PORT', 8080);
    const hostname = this.config.find('hostname');
    this.url = `http://${hostname}:${port}/`;
    this.config.set('URL', this.url);
    this.config.set('HTTP_URL', this.url);
    this.servers = {
      http: http.createServer(<any>this.app)
    };
  }

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
