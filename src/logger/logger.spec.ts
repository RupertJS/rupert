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
  it('configures', function(){
    let winston = {
      Logger: sinon.spy(),
      transports: {
        Console: sinon.spy(),
        File: sinon.spy()
      }
    };

    let logger: ILogger = new Logger(new Config({}), winston);

    expect(logger).to.exist;
    expect(winston.Logger).to.have.been.called;
  });
});
