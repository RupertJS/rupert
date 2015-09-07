import {
  Inject,
  Rupert,
  IPlugin,
  Config,
  Logger,

  Route,
  RoutePrefix,
  Request, Response, Next
} from '../src/rupert';

@RoutePrefix('/myapp')
class MyAppHandler implements IPlugin {
  constructor(
    @Inject(Logger) private _logger: Logger,
    @Inject(Config) private _config: Config,
    @Inject(App) private _app: Express.App,
    @Inject(Doorman) doorman: Rupert.Doorman
  ) {
    this._logger.info('Created a MyAppHandler');
    this._config.find<number>('foo.bar', 'FOO_BAR', 37);
  }

  @Rupert.Before(Rupert.Doorman.isLoggedIn)
  @Rupert.Handler.POST('/route')
  @Rupert.Handler('/route', {methods: ['POST']})
  route(q: Request, r: Response, n: Next) {}
  // // Becomes
  // get [Rupert.Handlers]() {
  //   return [
  //     {
  //       route: '/myapp/route',
  //       methods: [Rupert.POST],
  //       handler: this.route.bind(this)
  //     }
  //   ]
  // }
}

let generatorFn = function *(max: number): IterableIterator<number> {
  let i = 0;
  while (i < max) {
    yield i;
  }
}

const defaults = require('./server.json');

export const app = Rupert.createApp(defaults, [MyAppHandler]);

if (require.main === module) {
  app.start();
}
