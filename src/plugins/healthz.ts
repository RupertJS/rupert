import {
  RupertPlugin,
  Route,
  Request as Q,
  Response as S,
  Next as N
} from '../rupert';

export class Healthz extends RupertPlugin {
  @Route.GET('/healthz')
  ok(q: Q, s: S, n: N): void {
    s.send('OK!');
  }
}
