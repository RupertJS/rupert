/// <reference path='../../typings/mocha/mocha.d.ts' />
/// <reference path='../../typings/chai/chai.d.ts' />
/// <reference path='../../typings/supertest/supertest.d.ts' />

import { expect } from 'chai';
import * as request from 'supertest';
import {
  Request as Q, Response as S
} from 'express';

import {
  Rupert
} from '../rupert';

describe('Rupert App', function() {
  it('creates and injects a new Rupert app', function() {
    const app = Rupert.createApp({foo: 'bar'});
    expect(app.config.find('foo')).to.equal('bar');
  });

  it('has an express server', function(done) {
    const rupert = Rupert.createApp({log: {level: 'silent'}});
    rupert.app.all('/', (q: Q, s: S, n: Function) => {
      s.status(200).send('OK');
    });
    request(rupert.app)
      .get('/')
      .expect(200)
      .expect('set-cookie', /NODE_ENV=development/)
      .end(function(err?: any, res?: request.Response){
        if (err) { return done(err); }
        rupert.logger.data(res.header);
        rupert.logger.data(res.body);
        done();
      })
      ;
  });
});
