import {
  join,
  normalize
} from 'path';

import {
  Inject,
  Rupert,
  RupertPlugin,
  Config,
  ILogger,

  Route, Methods,
  Request, Response, Next,

  Plugins
} from 'rupert';

@Route.prefix('/myapp')
class MyAppHandler extends RupertPlugin
{
  constructor(
    @Inject(ILogger) private _logger: ILogger,
    @Inject(Config) private _config: Config,
    @Inject(Rupert) private _rupert: Rupert
    // @Inject(Doorman) doorman: Rupert.Doorman // Coming soon!
  ) {
    super()
    this._logger.info('Created a MyAppHandler');
    this._config.find<number>('foo.bar', 'FOO_BAR', 37);
    // this._rupert.app.
  }

  // @Route.Before(Rupert.Doorman.isLoggedIn) // TODO
  // or: @Route.POST('/route')
  @Route('/route', {methods: [Methods.POST]})
  action(q: Request, r: Response, n: Next) {}
}

const defaults: any = {
  log: {level: 'info'},
  static: {
    routes: {
      '/': normalize(join(__dirname, '../src/plugins/fixtures/static'))
    }
  }
};
export const server = Rupert.createApp(defaults, [
  MyAppHandler,
  Plugins.Healthz,
  Plugins.Static
]);

if (require.main === module) {
  server.start();
}
