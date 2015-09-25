/// <reference path="./typings/node/node.d.ts" />

import {
  Inject,
  Rupert,
  RupertPlugin,
  Config,
  ILogger,

  Route, Methods,
  Request, Response, Next
} from 'rupert';

// import {
//   Rupert
// } from 'rupert';

@Route.prefix('/myapp')
class MyAppHandler extends RupertPlugin
{
  constructor(
    @Inject(ILogger) private _logger: ILogger,
    @Inject(Config) private _config: Config,
    @Inject(Rupert) private _rupert: Rupert,
    // @Inject(Doorman) doorman: Rupert.Doorman // Coming soon!
  ) {
    super()
    this._logger.info('Created a MyAppHandler');
    this._config.find<number>('foo.bar', 'FOO_BAR', 37);
    // this._rupert.app.
  }

  // @Route.Before(Rupert.Doorman.isLoggedIn) // TODO
  @Route('/route', {methods: [Methods.POST]})
  // or: @Route.POST('/route')
  action(q: Request, r: Response, n: Next) {}
}

const defaults: any = {};

export const server = Rupert.createApp(defaults, [MyAppHandler]);

if (require.main === module) {

}
