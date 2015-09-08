/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />
/// <reference path="../../typings/sinon-chai/sinon-chai.d.ts" />

/* tslint:disable */
let sinonChai = require('sinon-chai');
/* tslint:enable */

import * as chai from 'chai';
import * as sinon from 'sinon';
let expect = chai.expect;
chai.use(sinonChai);

import {
  ILogger,
  Logger
} from './logger';

import { Config } from '../config/config';

describe('logger', function() {
  it('instantiates', function(){
    let winston = {
      Logger: sinon.spy(),
      transports: {
        Console: sinon.spy(),
        DailyRotateFile: sinon.spy()
      }
    };

    let morgan = sinon.spy();

    let logger: ILogger = new Logger(new Config({}), winston, morgan);

    expect(logger).to.exist;
    expect(winston.Logger).to.have.been.calledOnce;
    expect(winston.transports.Console).to.have.been.called;
    expect(winston.transports.DailyRotateFile).to.not.have.been.called;
    expect(morgan).to.have.been.calledWith ('tiny');
  });

  it('configures', function(){
    const level = 'warn';
    const file = '/var/log/file';
    const format = 'combined';
    const rotate = '.yyyy-MM-ddTHH';

    let config = new Config({ log: { level, file, format, rotate } });
    let winston = {
      Logger: sinon.spy(),
      transports: {
        Console: sinon.spy(),
        DailyRotateFile: sinon.spy()
      }
    };

    let morgan = sinon.spy();

    let logger: ILogger = new Logger(config, winston, <any>morgan);

    expect(logger).to.exist;
    expect(winston.transports.Console).to.have.been.calledOnce;
    expect(winston.transports.Console).to.have.been.calledWith({
      level,
      timestamp: true,
      colorize: true
    });
    expect(winston.transports.DailyRotateFile).to.have.been.calledOnce;
    expect(winston.transports.DailyRotateFile).to.have.been.calledWith({
      level,
      timestamp: true,
      datePattern: rotate,
      filename: file,
    });
    expect(winston.Logger).to.have.been.called;
    expect(morgan).to.have.been.calledWith(format);
  });

  it('logs', function() {
    // Create a mock winston logger, call each method on ILogger, and assert
    // the logger mock was called.
    throw new Error(`Unimplemented test!`);
  });
});
