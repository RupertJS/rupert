import * as express from 'express';
import * as Winston from 'winston';
import * as Morgan from 'morgan';

export {QueryOptions} from 'winston';

import {Config} from '../config/config';
import {Inject, Optional} from '../di/di';

// General Winston setup for colors and levels.
(<any>Winston).config.npm.colors.http = 'magenta';
(<any>Winston).config.npm.colors.data = 'grey';
(<any>Winston).addColors((<any>Winston).config.npm.colors);

const LEVELS = {
  silly: -Infinity,
  data: 100,
  debug: 500,
  verbose: 1000,
  http: 2000,
  info: 2000,
  warn: 4000,
  error: 5000,
  silent: Infinity
};

export class ILogger {
  get middleware(): express.RequestHandler {
    throw new Error('Unsupported Operation: Abstract class');
  }

  /**
   * Log a ridiculously silly amount of data. This represents logging at the
   * absolute lowest possible level, and calls to `silly` should probably not
   * be present in production applications. For instance, could be used by a
   * decorator to trace in and out of every function invocation.
   */
  silly(msg: string, meta: any = null): ILogger {
    throw new Error('Unsupported Operation: Abstract class');
  }

  /**
   * Log stack-trace amounts of data. Should be in conjunction after `error` or
   * `warn` to show stack traces on exceptions, or with `http` to log request
   * data (headers, body, etc).
   */
  data(msg: string, meta: any = null): ILogger {
    throw new Error('Unsupported Operation: Abstract class');
  }

  /**
   * Log information that might be useful to tracing the behavior of a running
   * program that has been crashing often. This could include instantiation of
   * services,
   */
  debug(msg: string, meta: any = null): ILogger {
    throw new Error('Unsupported Operation: Abstract class');
  }

  /**
   * Non critical but useful messages to follow program behavior. For instance,
   * logging which files will be compiled by a plugin.
   */
  verbose(msg: string, meta: any = null): ILogger {
    throw new Error('Unsupported Operation: Abstract class');
  }

  /**
   * Reserved for logging HTTP-level application requests. Logged and formatted
   * using morgan.
   */
  http(msg: string, meta: any = null): ILogger {
    throw new Error('Unsupported Operation: Abstract class');
  }

  /**
   * A reasonable default logging level. Log messages that would be useful to
   * debugging a crashed program, or gaining insight into the general operation
   * of a program. For instance, application startup banners, loading and
   * unloading plugins, compiler warnings in secondary plugins, opening and
   * closing database connections, or logging incoming application requests.
   */
  info(msg: string, meta: any = null): ILogger {
    throw new Error('Unsupported Operation: Abstract class');
  }

  /**
   * An alias for ILogger.info.
   */
  log(msg: string, meta: any = null): ILogger { return this.info(msg, meta); }

  /**
   * Log messages indicating impending program failure. For instance, compiler
   * errors in secondary plugins, compiler warnings in core plugins, nearing
   * connection saturation, or latencies approaching SLO thresholds.
   */
  warn(msg: string, meta: any = null): ILogger {
    throw new Error('Unsupported Operation: Abstract class');
  }

  /**
   * The highest typical logging level. Should be used for application errors,
   * when the application cannot reasonably continue processing. For instance,
   * compiler compilation errors in core plugins, saturating a connection
   * pool beyond its constraints, or losing a lock on a shared resource in the
   * middle of an update.
   */
  error(msg: string, meta: any = null): ILogger {
    throw new Error('Unsupported Operation: Abstract class');
  }

  /**
   * Log a message at `silent`, the highest priority. Messages logged to
   * `silent` will (paradoxically) *always* be written.
   */
  silent(msg: string, meta: any = null): ILogger {
    throw new Error('Unsupported Operation: Abstract class');
  }

  query(options?: Winston.QueryOptions,
        callback?: (err: Error, results: any) => void): any {
    throw new Error('Unsupported Operation');
  }

  profile(id: string, msg?: string, meta: any = null): ILogger {
    throw new Error('Unsupported Operation: Abstract class');
  }
}
;

// This gets replaced with a real handler in `configureLogging`.
let _morgan: express.RequestHandler = function(
    req: express.Request, res: express.Response, next: Function): void {
  next();
};

export function getMiddleware(): express.RequestHandler {
  return _morgan;
}

export class Logger extends ILogger {
  private _logger: Winston.LoggerInstance;
  private _morgan: express.RequestHandler;

  constructor(@Inject(Config) config: Config,
              @Optional() @Inject(Winston) winston: any = Winston,
              @Optional() @Inject(Morgan) morgan: any = Morgan) {
    super();

    let transports: Winston.TransportInstance[] = [];

    const level = config.find('log.level', 'LOG_LEVEL', 'http');
    const logConsole = config.find<boolean>('log.console', 'LOG_CONSOLE', true);
    const filename: string | boolean =
        config.find<string | boolean>('log.file', 'LOG_FILE', false);
    const format = config.find('log.format', 'LOG_FORMAT', 'tiny');
    const datePattern = config.find('log.rotate', 'LOG_ROTATE', '.yyyy-MM-dd');

    if (logConsole === true) {
      transports.push(new winston.transports.Console(
          <Winston.TransportOptions>{level, timestamp: true, colorize: true}));
    }

    if (filename !== false) {
      transports.push(
          new winston.transports.DailyRotateFile(<Winston.TransportOptions>{
            level,
            timestamp: true, datePattern, filename
          }));
    }

    this._logger = new (winston.Logger)({levels: LEVELS, transports});

    this._morgan =
        morgan(format,
               {stream: {write: (message: string) => { this.http(message); }}});

    Object.keys(LEVELS).forEach(
        level => this[level] = 
          (msg: string, meta: any) => this._log(level, msg, meta));
  }

  private _log(level: string, msg: string, meta: any = null): ILogger {
    this._logger.log(level, msg, meta);
    return this;
  }

  query(options: Winston.QueryOptions,
        callback: (err: Error, results: any) => void): void {
    this._logger.query(options, callback);
  }

  profile(id: string, msg?: string, meta: any = null): ILogger {
    this._logger.profile(id, msg, meta);
    return this;
  }

  get middleware(): express.RequestHandler { return this._morgan; }
}
