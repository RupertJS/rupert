import {
  Inject,
  Rupert,
  RupertPlugin,
  Config,
  ILogger,

  Route,
  Request, Response, Next
} from '../src/rupert';

@Route.Prefix('/myapp')
class MyAppHandler extends RupertPlugin {
  constructor(
    @Inject(ILogger) private _logger: ILogger,
    @Inject(Config) private _config: Config,
    // @Inject(App) private _app: Express.Application,
    // @Inject(Doorman) doorman: Rupert.Doorman
  ) {
    super()
    this._logger.info('Created a MyAppHandler');
    this._config.find<number>('foo.bar', 'FOO_BAR', 37);
  }

  // @Route.Before(Rupert.Doorman.isLoggedIn)
  // @Route.POST('/route')
  @Route('/route', {methods: [Route.POST]})
  action(q: Request, r: Response, n: Next) {}
  // // Becomes
  // get [Rupert.Handlers]() {
  //   return [
  //     {
  //       route: '/myapp/route',
  //       methods: ['POST'],
  //       handler: this.action.bind(this)
  //     }
  //   ]
  // }
}

// let generatorFn = function *(max: number): IterableIterator<number> {
//   let i = 0;
//   while (i < max) {
//     yield i;
//   }
// }

const defaults = <any>require('./server.json');

export const app = Rupert.createApp(defaults, [MyAppHandler]);

if (require.main === module) {
  app.start();
}
