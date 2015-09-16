/// <reference path='../../typings/mocha/mocha.d.ts' />
/// <reference path='../../typings/es6-promise/es6-promise.d.ts' />

import { expect, spy } from '../util/specs';
import { request, requestApp, IRupertTest } from '../util/request';

import {
  Request as Q, Response as S
} from 'express';

import {
  Rupert,
  Config
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
    requestApp(rupert.app)
      .get('/')
      .expect(200)
      .expect('set-cookie', /NODE_ENV=development/)
      .end(done)
      ;
  });

  describe('servers', function() {
    let config: Config = new Config({hostname: 'rupert-test'});
    let configSpy = spy();
    let logger: any;

    beforeEach(function() {
      configSpy = spy(config, 'find');
      logger = getMockLogger();
    });

    it('makes an insecure server', function(done) {
      const rupert = new Rupert(config, logger);

      expect(rupert.servers.http).to.exist;
      expect(rupert.servers.https).to.not.exist;
      expect(rupert.url).to.equal('http://rupert-test:8080/');

      rupert.app.all('/', (q: Q, s: S, n: Function) => {
        s.status(200).send('OK');
      });

      request(rupert).then((test: IRupertTest) => {
        test.get('/').expect(200).finish(done);
      }).catch(done);
    });
  });
});
