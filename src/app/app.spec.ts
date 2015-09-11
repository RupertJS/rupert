/// <reference path='../../typings/mocha/mocha.d.ts' />
/// <reference path='../../typings/supertest/supertest.d.ts' />
/// <reference path="../../typings/mocha/mocha.d.ts" />

import { expect, spy } from '../util/specs';

import * as request from 'supertest';
import {
  Request as Q, Response as S
} from 'express';

import {
  Rupert
} from '../rupert';

import {
  getMockLogger
} from '../logger/mockLogger';

describe('Rupert App', function() {
  it('creates and injects a new Rupert app', function() {
    const app = Rupert.createApp({foo: 'bar'});
    expect(app.config.find('foo')).to.equal('bar');
  });

  it('has an express application', function(done) {
    const rupert = Rupert.createApp({log: {level: 'silent'}});
    rupert.app.all('/', (q: Q, s: S, n: Function) => {
      s.status(200).send('OK');
    });
    request(rupert.app)
      .get('/')
      .expect(200)
      .expect('set-cookie', /NODE_ENV=development/)
      .end(done)
      ;
  });

  describe.only('servers', function() {
    let config: any = {};
    let logger: any;
    beforeEach(function() {
      config.find = spy();
      logger = getMockLogger();
    });

    it('makes an insecure server', function() {
      const rupert = new Rupert(config, logger);
      expect(rupert.app).to.exist;
      expect(config.find).to.have.been.called;
    });
  });
});
