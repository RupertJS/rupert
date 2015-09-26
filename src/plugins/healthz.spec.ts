import { requestApp } from '../util/request';

import {
  Rupert
} from '../rupert';

import {
  Healthz
} from './plugins';

describe('healthz', function() {
  it('pings health', function(done) {
    const rupert = Rupert.createApp({log: {level: 'silent'}}, [Healthz]);

    requestApp(rupert.app)
      .get('/healthz')
      .expect(200, 'OK!', done)
      ;
  });
});
