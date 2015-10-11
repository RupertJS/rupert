import {
  RupertPlugin,
  Route,
  Inject,
  Config,
  ILogger,
  Request as Q,
  Response as S,
  Next as N
} from '../rupert';

import * as stassets from 'stassets';

export class Stassets extends RupertPlugin {
  private _handler: stassets.RequestHandler;
  constructor(
    @Inject(Config) config: Config,
    @Inject(ILogger) private _logger: ILogger
  ) {
    super();
    let stConf = config.find<any>('stassets');
    this._logger.verbose('Configuration loaded.', stConf);
    this._handler = stassets(stConf);
  }

  ready(): Thenable<void> {
    return this._handler.promise;
  }

  @Route.GET('/index.html')
  ok(q: Q, s: S, n: N): void {
    this._logger.verbose('Should be http', q.path);
    this._handler(q, s, n);
  }
}
