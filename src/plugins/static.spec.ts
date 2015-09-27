import { requestApp } from '../util/request';

import {
  join
} from 'path';

import {
  Rupert
} from '../rupert';

import {
  Static
} from './plugins';

describe('static', function() {
  it.skip('serves fixtures', function(done) {
    // This test works when it's the only test.
    const config: any = {
      log: {level: 'silent'},
      static: {
        routes: {
          '/': join(__dirname.replace('dist', 'src'), '/fixtures/static')
        }
      }
    };
    let rupert = Rupert.createApp(config, [Static]);

    requestApp(rupert.app)
      .get('/index.md')
      .expect(200, '# It works!\n', done)
      ;
  });
});
