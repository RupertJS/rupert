import {expect} from '../util/specs';
import {request, requestApp, IRupertTest} from '../util/request';

import * as mockfs from 'mock-fs';

import {Request as Q, Response as S} from 'express';

import {
  Rupert,
  Config,
  IPlugin,
  IPluginHandler,
  RupertPlugin,
  Route,
  Methods,
  ILogger,
  Inject,
  Injector,
  bind
} from '../rupert';

import {getMockLogger} from '../logger/mockLogger';

describe('Rupert App', function() {
  it('creates and injects a new Rupert app', function() {
    const app = Rupert.createApp({foo: 'bar'});
    expect(app.config.find('foo')).to.equal('bar');
  });

  it('has an express application', function(done) {
    const rupert = Rupert.createApp({log: {level: 'silent'}});
    rupert.app.all('/',
                   (q: Q, s: S, n: Function) => { s.status(200).send('OK'); });
    requestApp(rupert.app)
        .get('/')
        .expect(200)
        .expect('set-cookie', /NODE_ENV=development/)
        .end(done);
  });

  describe('servers', function() {
    it('makes an insecure server', function(done) {
      let config: Config = new Config({hostname: 'rupert-test'});
      const rupert = new Rupert(config, getMockLogger());

      expect(rupert.servers.http).to.exist;
      expect(rupert.servers.https).to.not.exist;
      expect(rupert.url).to.equal('http://rupert-test:8080/');

      rupert.app.all(
          '/', (q: Q, s: S, n: Function) => { s.status(200).send('OK'); });

      request(rupert)
          .then((test: IRupertTest) => {
            test.get('/').expect(200).finish(done);
          })
          .catch(done);
    });

    it('makes a secure server', function(done) {
      /** tslint:disable */
      mockfs({
        'env/': {
          'server.key':
              '-----BEGIN RSA PRIVATE KEY-----\n' +
                  'MIIEowIBAAKCAQEAoZxMSVqJJ9rXscfOVEN5bhWqx/z89TkPsoWjSQzBGxWS64e7\n' +
                  'KyytRJ5beKReYAwTZ60wDfTkHJ0lgGxapvIs2wxl1B3ShnUT9FYR61FDGv5+rc2c\n' +
                  'C67suqSA7pR+KfRM3q9mvc0hOZk0AXXX5HKhP7nxOsH9zGRbQw/yHC3PDGuJhDNG\n' +
                  '3IQWTrRP9QrmWdtO3no8WBOTLyK7duPjAiqz0o+C8wXsZvUb7+Ct7KPYDYWWw7vg\n' +
                  '4ychlAA+j8iBbeXtCRAa8cWWBpIjWQGI+C7B0APpiGUy6PwayLooE+tzmePcuTor\n' +
                  'JTY9/6k2PxthncRzo7OA6EQyEHzX1OxftupS9wIDAQABAoIBAH9ivdcMIBRkMaSW\n' +
                  'hBJzZSHavlUJGzMIGVF0eTK5dPUuWjKBOI1dl+4AjMVZenJm0lzkbH5zy+KqE8dY\n' +
                  'oVP6jFTVPual4y3M1z+/IDzGPwjmFWBWM2waI8syo9ZrAc98G6Njyq5NJKVMF2wX\n' +
                  'QWd225dpr7XK94zGhhEkXojLqup0EILdw8f2kB8oq8ZzRuRixb60d+jESjlvW04R\n' +
                  'rYUTieQHXgFO4JG7qS7LONNOCciwL4CawCD6TumZvJ086w90H2+DGIhzQSt398dP\n' +
                  'xZkPre/sJT1fdu8JFTIxe5dnqU+4xX+oVb1B3AzWyBFD77TUmKN8ebxWWQaAgW+f\n' +
                  '1ZMAeuECgYEA0sLWtVMXVJoMZZqQOM4NKXqQErayUVCKK5bRmSJSIUcB6toC/kcz\n' +
                  'C9n6euDML/BGTXgbMMyUsJWTc9NEJihrO75zZf1Yn8Z/GaWENUzcrgWVIIpr1/AF\n' +
                  '0hDmsQVeimgyLKZX89YqYaiuUVT2oSkmZrtOiojnwjuVW5fqi5TsMikCgYEAxEys\n' +
                  'jMBArjYiPI/8PgFsvyXCdvPZ5zOyYJxm371yycDhOdFUCQfC9dF4JVECZh72R0eN\n' +
                  'iRahHFdvfJxCB0LTu0s2zuKWFgCtAR8ZZW0cV83pRgu8xpZdLCrGPpFVkoXC/KgU\n' +
                  'cyAwADmrCLbSl4SVQv5aNmLFKci0qQbqJ4hWQB8CgYBYIcuA5W8THJvkfN6kMl3E\n' +
                  'o5DNkoI8iI5OrfGVtIldiwDdQS8RP5qz8QHSEmCwByyOxpOwM0xWDyYqwAR2ZF57\n' +
                  'DCfbVTaTEYEiq1j+pNZ/GqyCf/+au67jadfd3F3tSKb6jtCmkT8FuXCzZ/D98WQy\n' +
                  'f07XlWo8iYfqVjtpBOxECQKBgQCed29MaN9OQ/E7htkQjUHmxWrJcG3WUUuM5nW9\n' +
                  '5UhHSugHLs9yQsvGegVNyqnvGsuiG0dNBfGl2YfsxpAfIHmg10U1moGi3YTMRPjR\n' +
                  'glXBJD9PBqasgjJRN262j8jO8iDIqj9n+PIHHIbQEBbNroB4hrD4+p9D7fy5/xUE\n' +
                  'OPG37QKBgFWN0cqLSLNa4anckTbqNF4919QEL++t6MBuDHjuwP1ehHQoy4SNn1A4\n' +
                  'CY0IjWkdiRysNJhjbRQEn/MJcugVeIKw6oVNM0ScNftp3z1ZLCRlK1rqtKK/tCLN\n' +
                  'DxeV31sZ3Jbjt4ie8PfPRl3IN9IaQxM62yUgbQHE+IT+i+jrrV/3\n' +
                  '-----END RSA PRIVATE KEY-----\n',
          'server.crt':
              '-----BEGIN CERTIFICATE-----\n' +
                  'MIIE3DCCA8SgAwIBAgIJAO0Vqmwuh6VAMA0GCSqGSIb3DQEBBQUAMIGkMQswCQYD\n' +
                  'VQQGEwJVUzEVMBMGA1UECBMMUGVubnN5bHZhbmlhMRMwEQYDVQQHEwpQaXR0c2J1\n' +
                  'cmdoMRcwFQYDVQQKEw5UaGlyZCBDYXQsIExMQzERMA8GA1UECxMIZHNvdXRoZXIx\n' +
                  'FjAUBgNVBAMTDURhdmlkIFNvdXRoZXIxJTAjBgkqhkiG9w0BCQEWFmRhdmlkc291\n' +
                  'dGhlckBnbWFpbC5jb20wHhcNMTUwOTE3MDEyNDMxWhcNMjUwOTE0MDEyNDMxWjCB\n' +
                  'pDELMAkGA1UEBhMCVVMxFTATBgNVBAgTDFBlbm5zeWx2YW5pYTETMBEGA1UEBxMK\n' +
                  'UGl0dHNidXJnaDEXMBUGA1UEChMOVGhpcmQgQ2F0LCBMTEMxETAPBgNVBAsTCGRz\n' +
                  'b3V0aGVyMRYwFAYDVQQDEw1EYXZpZCBTb3V0aGVyMSUwIwYJKoZIhvcNAQkBFhZk\n' +
                  'YXZpZHNvdXRoZXJAZ21haWwuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB\n' +
                  'CgKCAQEAoZxMSVqJJ9rXscfOVEN5bhWqx/z89TkPsoWjSQzBGxWS64e7KyytRJ5b\n' +
                  'eKReYAwTZ60wDfTkHJ0lgGxapvIs2wxl1B3ShnUT9FYR61FDGv5+rc2cC67suqSA\n' +
                  '7pR+KfRM3q9mvc0hOZk0AXXX5HKhP7nxOsH9zGRbQw/yHC3PDGuJhDNG3IQWTrRP\n' +
                  '9QrmWdtO3no8WBOTLyK7duPjAiqz0o+C8wXsZvUb7+Ct7KPYDYWWw7vg4ychlAA+\n' +
                  'j8iBbeXtCRAa8cWWBpIjWQGI+C7B0APpiGUy6PwayLooE+tzmePcuTorJTY9/6k2\n' +
                  'PxthncRzo7OA6EQyEHzX1OxftupS9wIDAQABo4IBDTCCAQkwHQYDVR0OBBYEFE1g\n' +
                  'QSw3dn2IU2BjEh9t9B2m5OnjMIHZBgNVHSMEgdEwgc6AFE1gQSw3dn2IU2BjEh9t\n' +
                  '9B2m5OnjoYGqpIGnMIGkMQswCQYDVQQGEwJVUzEVMBMGA1UECBMMUGVubnN5bHZh\n' +
                  'bmlhMRMwEQYDVQQHEwpQaXR0c2J1cmdoMRcwFQYDVQQKEw5UaGlyZCBDYXQsIExM\n' +
                  'QzERMA8GA1UECxMIZHNvdXRoZXIxFjAUBgNVBAMTDURhdmlkIFNvdXRoZXIxJTAj\n' +
                  'BgkqhkiG9w0BCQEWFmRhdmlkc291dGhlckBnbWFpbC5jb22CCQDtFapsLoelQDAM\n' +
                  'BgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4IBAQCOxNW7hBGygnG3RCEx9B+Z\n' +
                  'A4gmmD6D/sW/Bi4jHXH4NrVZu+FnRL2w44joctIQeS04Oir9LNWJrcvlmPnuQ8RJ\n' +
                  'khcw0VBgWU6HaAYQX5PpVd+ySa/IL33A/e6oKJeUqFJ+kKik87SWDfWS9ixQDR4K\n' +
                  'iRGDCpmP+ivKxa4WSrSOjL71PXoNxwRWFdPMpe535xkcaGjW7lk1rMj/nKOK6q04\n' +
                  '6PyO4ZpcCF6MuRTr4UN721Ae5unBhZv72RdX6ND6FT9P1mdviiiFimZuqCf8ZLMk\n' +
                  'uSBRBM5Jv/9F7QNpodN8TIyA5u96dCwRHvVafD4biT40lPfauPoOTn66g3IOX2Sj\n' +
                  '-----END CERTIFICATE-----\n'
        },
      });
      /** tslint:enable */

      after(mockfs.restore);

      let config: Config = new Config({hostname: 'rupert-test', tls: {}});

      const rupert = new Rupert(config, getMockLogger());

      expect(rupert.servers.http).to.exist;
      expect(rupert.servers.https).to.exist;
      expect(rupert.url).to.equal('https://rupert-test:8443/');

      rupert.app.all(
          '/', (q: Q, s: S, n: Function) => { s.status(200).send('OK'); });

      request(rupert)
          .then((test: IRupertTest) => {
            test.get('/').expect(200).finish(done);
          })
          .catch(done);
    });
  });

  describe('plugins', function() {
    it('loads plugins in an app context', function() {
      let config: Config = new Config({hostname: 'rupert-test'});
      let logger: ILogger = getMockLogger();
      let injector = Injector.create([
        bind(Config)
            .toValue(config),
        bind(ILogger).toValue(logger),
        bind(Injector).toFactory(() => injector)
      ]);

      let testRupert: Rupert | null = null;
      class InjectPlugin implements IPlugin {
        public handlers: IPluginHandler[] = [];
        ready(): Promise<void> { return Promise.resolve<void>(); }
        constructor(@Inject(Rupert) rupert: Rupert) { testRupert = rupert; }
      }

      const rupert = new Rupert(config, logger, injector, [InjectPlugin]);

      expect(testRupert).to.equal(rupert);
    });

    it('waits for plugins to load', function(done) {
      let config: Config = new Config({hostname: 'rupert-test'});
      let logger: ILogger = getMockLogger();
      let injector = Injector.create([
        bind(Config)
            .toValue(config),
        bind(ILogger).toValue(logger),
        bind(Injector).toFactory(() => injector)
      ]);

      let started = false;
      class StarterPlugin implements IPlugin {
        handlers: IPluginHandler[] = [];
        ready(): Thenable<void> {
          started = true;
          return Promise.resolve<void>();
        }
      }

      const rupert = new Rupert(config, logger, injector, [StarterPlugin]);
      expect(started).to.be.false;
      rupert.start().then(() => {
        expect(started).to.be.true;
        done();
      });
    });

    it('utilizes plugin handlers', function(done) {
      class TestPlugin implements IPlugin {
        ready(): Promise<void> { return Promise.resolve<void>(); }
        public handlers: IPluginHandler[] = [
          {
            methods: [Methods.GET],
            route: '/plugin',
            handler: (q: Q, s: S) => { s.send('OK!'); }
          }
        ];
      }

      const rupert = Rupert.createApp({log: {level: 'silent'}}, [TestPlugin]);

      requestApp(rupert.app).get('/plugin').expect(200).expect(/OK/).end(done);
    });

    describe('routing', function() {
      it('allows basic routing behaviors', function(done) {
        const rupert = Rupert.createApp({log: {level: 'silent'}}, [TestPlugin]);

        requestApp(rupert.app)
            .get('/plugin')
            .expect(200)
            .expect(/OK/)
            .end(done);
      });

      it('allows setting a prefix for a plugin', function(done) {
        const rupert =
            Rupert.createApp({log: {level: 'silent'}}, [PrefixTestPlugin]);

        requestApp(rupert.app)
            .get('/api/plugin')
            .expect(200)
            .expect(/OK/)
            .end(done);
      });
    });
  });
});

class TestPlugin extends RupertPlugin {
  public status: string = 'OK!';

  @Route
      .GET('/plugin') ok(q: Q, s: S): void {
    s.send(this.status);
  }
}

@Route
    .prefix('/api') class PrefixTestPlugin extends RupertPlugin {
  public status: string = 'OK!';

  @Route
      .GET('/plugin') ok(q: Q, s: S): void {
    s.send(this.status);
  }
}
