/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/winston/winston.d.ts" />
/// <reference path="../../typings/morgan/morgan.d.ts" />
/// <reference path="../../typings/debug/debug.d.ts" />

import * as express from 'express';
import * as winston from 'winston';
import * as morgan from 'morgan';
import * as _debug from 'debug';
const debug = _debug('rupert:logger');

import { Config } from '../config/config';

export interface ILogger extends winston.LoggerInstance {};

(<any>winston).config.npm.colors.http = 'magenta';
(<any>winston).config.npm.colors.data = 'grey';
(<any>winston).addColors((<any>winston).config.npm.colors);

winston.setLevels({
  silly: -Infinity,
  data: 100,
  debug: 500,
  verbose: 1000,
  http: 2000,
  info: 3000,
  warn: 4000,
  error: 5000,
  silent: Infinity
});

export interface ILogger extends winston.LoggerInstance {};

const stream = function(message: string): void {
  (<any>winston).http(message);
}

let _morgan: express.RequestHandler = function(
  req: express.Request,
  res: express.Response,
  next: Function
): void {
  next();
}

export function getMiddleware(): express.RequestHandler {
  return _morgan;
}

export function configureLogging(config: Config): ILogger {
  const level = config.find('log.level', 'LOG_LEVEL', 'http');
  const file:string|boolean = config.find('log.file', 'LOG_FILE', false);
  const format = config.find<string>('log.format', 'LOG_FORMAT', 'tiny');

  try {
    winston.remove(winston.transports.Console)
  } catch (E) {
    debug('Failed to remove default Console transport.')
  }

  const logConsole = config.find('log.console', 'LOG_CONSOLE', false);
  if (logConsole) {
    winston.add(
      winston.transports.Console,
      <winston.TransportOptions>{
        level,
        timestamp: true,
        colorize: true
      }
    );
  }

  try {
    winston.remove(winston.transports.File)
  } catch (E) {
    debug('Failed to remove degult File transport.');
  }
  if (file !== false) {
    winston.add(
      winston.transports.File,
      <winston.TransportOptions>{
        level,
        timestamp: true,
        filename: file
      }
    );
  }

  _morgan = morgan(format, {stream});

  return winston.defaultLogger;
}

export default <ILogger>winston.defaultLogger;
