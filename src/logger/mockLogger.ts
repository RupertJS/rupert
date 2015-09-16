/// <reference path="../../typings/sinon/sinon.d.ts" />

import {
  spy, stub
} from 'sinon';

import {
  ILogger
} from './logger';

export function getMockLogger(): ILogger {
  return {
    middleware: stub().returns((q: any, s: any, n: Function): void => n()),
    silly: spy(),
    data: spy(),
    debug: spy(),
    verbose: spy(),
    http: spy(),
    info: spy(),
    log: spy(),
    warn: spy(),
    error: spy(),
    silent: spy(),
    query: spy(),
    profile: spy()
  };
}
