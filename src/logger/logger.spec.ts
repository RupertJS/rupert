/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

// import { expect } from 'chai';

import {
  // Logger as logger,
  configureLogging
} from './logger';

import { Config } from '../config/config';

describe('logger', function() {
  it('configures', function(){
    // this file is basically untestable without DI and mocks.
    // We have DI now!
    configureLogging(new Config());
  });
});