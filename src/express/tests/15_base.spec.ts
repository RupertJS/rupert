/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai';

import { Express } from 'express';

import { makeApp } from '../15_base';
import { Config } from '../../config/Config';

describe('Base Express App', function() {
  it('returns an Express app', function() {
    const app: Express = makeApp(new Config());
  });
});