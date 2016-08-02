import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import {EventEmitter} from 'events';
import * as Path from 'path';

import {makeCert} from './cert';

import {Inject, Injector, bind, Constructor} from '../di/di';

import {Config, ConfigValue} from '../config/config';

import {ILogger, Logger} from '../logger/logger';

import {
  IPlugin,
  IPluginHandler,
  Methods,
  PluginList,
  Pluginable,
  NormalizePluginlist
} from '../plugin/plugin';

type RupertReady = {
  server: http.Server | https.Server,
  port: number,
  name: string,
  url: string
};

export class Rupert extends EventEmitter {
  private _app: express.Application;
  private _environment: String;
  private _listeners: EventEmitter[] = [];
  private _plugins: IPlugin[];

  public root: string =
      typeof global.root === 'string'?<string><any>global.root: process.cwd();
  public url: string;
  public name: string;
  public servers: {http: http.Server, https?: https.Server};

  constructor(
      @Inject(Config) private _config: Config,
      @Inject(ILogger) private _logger: ILogger,
      @Inject(Injector) private _injector: Injector = new Injector([]),
      // TODO Make this work with an array of IPlugin ctors and factories
      @Inject(PluginList) plugins: Pluginable[] = []) {
    super();

    this._normalize();

    this.name = this.config.find('name', 'APP_NAME', 'rupert-app');

    this._environment =
        this.config.find('environment', 'NODE_ENV', 'development');

    const maxUpload = this.config.find('uploads.size', 'UPLOAD_SIZE', '100kb');
    this.logger.debug(`Max upload size: ${maxUpload}`);

    this._app = express()
                    .use(require('cookie-parser')())
                    .use(require('body-parser').json({limit: maxUpload}))
                    .use(this.logger.middleware);

    if (this.environment === 'development') {
      this.app.use(
          require('errorhandler')({dumpExceptions: true, showStack: true}));
      this.app.use(
          (req: express.Request, res: express.Response, next: Function) => {
            // Let the browser know we can be promiscuous in debug info.
            res.cookie('NODE_ENV', this.environment, {maxAge: 900000});
            next();
          });
    }

    this._configureServers();
    this._configurePlugins(plugins);
  }

  public start(): Promise<Rupert> {
    let readies: any[] = [];

    if (this.servers.https) {
      readies.push(this._startServer(
          this.servers.https, this.config.find<number>('tls.port'),
          `${this.name} tls`, this.config.find<string>('HTTPS_URL')));
    }

    readies.push(this._startServer(this.servers.http,
                                   this.config.find<number>('port'), this.name,
                                   this.config.find<string>('HTTP_URL')));

    return Promise.all(readies).then(() => this);
  }

  private _startServer(server: http.Server | https.Server, port: number,
                       name: string, url: string): Promise<Rupert> {
    return new Promise<void>((resolve: Function, reject: Function) => {
             let listener: EventEmitter | null = null;
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
             listener.on('error', (err: any) => { reject(err); });
           })
        .then(() => Promise.all(this._plugins.map((_: IPlugin) => _.ready())))
        .then(() => this);
  }

  public stop(): Promise<Rupert> {
    this.logger.info(`Stopping #{this.name}...`);
    this.emit('stopping');
    this.emit('close');

    let closers = this._listeners.map((_: EventEmitter) => {
      return new Promise((resolve: Function, reject: Function) => {
        _.on('close', () => { resolve(); });
        (<any>_).close();
      });
    });

    return Promise.all(closers).then(() => this);
  }

  private _normalize() {
    this.root = this.config.find('root', this.root);
    this._logger.debug('Root directory is ' + this.root);
    this.config.find('hostname', 'HOST', require('os').hostname());
  }

  private _configureServers() {
    const tls = this.config.find<boolean>('tls', 'TLS', false);
    if (tls !== false) {
      this._secureServer(this.app);
    } else {
      this._unsecureServer(this.app);
    }
    this.url = this.config.find<string>('URL');
    process.env.URL = this.url;
  }

  private _secureServer(app: express.Application) {
    const port = this.config.find<number>('tls.port', 'HTTPS_PORT', 8443);
    const root = this.config.find('root');

    const keyPath = Path.join(root, 'env', 'server.key');
    const certPath = Path.join(root, 'env', 'server.crt');

    const keyFile = this.config.find('tls.key', 'SSL_KEY', keyPath);
    const certFile = this.config.find('tls.cert', 'SSL_CERT', certPath);

    const writeCert =
        this.config.find<boolean>('tls.writeCert', 'WRITE_CERT', false);
    const validDays = this.config.find<number>('tls.days', 'CERT_DAYS', 1);

    const tlsOptions =
        makeCert(keyFile, certFile, writeCert, validDays, this.logger);

    const hostname = this.config.find('hostname');
    const httpsUrl = `https://${hostname}:${port}/`;
    this.config.set('HTTPS_URL', httpsUrl);

    const httpApp = express().use(
        (q, s, n) => { s.redirect(this.config.find<string>(httpsUrl)); });

    this._unsecureServer(httpApp);
    this.servers.https = https.createServer(tlsOptions, app);
    this.config.set('URL', httpsUrl);
  }

  private _unsecureServer(app: express.Application) {
    const port = this.config.find<number>('port', 'HTTP_PORT', 8080);
    const hostname = this.config.find('hostname');
    const url = `http://${hostname}:${port}/`;
    this.config.set('URL', url);
    this.config.set('HTTP_URL', url);
    this.servers = {http: http.createServer(<any>app)};
  }

  private _configurePlugins(plugins: Pluginable[]) {
    this._logger.verbose(`Instantiating ${plugins.length} plugins.`);
    if (plugins.length <= 0) {
      this._plugins = [];
      return;  // nothing to configure!
    }
    let pluginInjector: Injector =
        this._injector.createChild([bind(Rupert).toValue(this)]);
    const app = this._app;
    this._plugins =
        NormalizePluginlist(plugins, pluginInjector)
            .map((plugin: IPlugin) => {
              this._logger.verbose(
                  `Attaching ${plugin.handlers.length} handlers.`);
              plugin.handlers.forEach((handler: IPluginHandler): void => {
                let methods = handler.methods.map((_) => Methods[_]).join(',');
                this._logger.debug(`[${methods}] ${handler.route}`);
                handler.methods.forEach((method: Methods) => {
                  let httpmethod = Methods[method].toLowerCase();
                  app[httpmethod](handler.route, handler.handler);
                });
              });
              return plugin;
            });
  }

  get logger(): ILogger { return this._logger; }
  get config(): Config { return this._config; }
  get environment(): String { return this._environment; }
  get app(): express.Application { return this._app; }

  static createApp(config: ConfigValue,
                   plugins: Constructor<IPlugin>[] = []): Rupert {
    const injector = Injector.create([
      bind(Injector)
          .toFactory(getInjector),
      bind(Config).toFactory(() => new Config(config, process.argv)),
      bind(ILogger).toClass(Logger),
      bind(PluginList).toValue(plugins),
      bind(Rupert).toClass(Rupert)
    ]);

    function getInjector() { return injector; }

    return <Rupert>injector.get(Rupert);
  }
}
