import { requestApp } from '../util/request';

import {
  join,
  normalize
} from 'path';

import {
  Rupert
} from '../rupert';

import {
  Stassets
} from './plugins';

describe.skip('stassets', function() {
  it('compiles & serves fixtures', function(done) {
    // This test works when it's the only test.
    const config: any = {
      log: {level: 'silent'},
      stassets: {
        root: [
          normalize(join(__dirname.replace('dist', 'src'), 'fixtures/stassets'))
        ]
      }
    };
    let rupert = Rupert.createApp(config, [Stassets]);

    requestApp(rupert.app)
      .get('/index.html')
      .expect(200)
      .expect(new RegExp('<h1>It works!</h1>'))
      .end(done)
      ;
  });
});
