import {
  Inject,
  Injector,
  bind
} from '../di/di';

import {
  Config,
  ConfigValue
} from '../config/config';

import {
  ILogger,
  Logger
} from '../logger/logger';

export class Rupert {
  constructor(
    @Inject(Config) private _config: Config,
    @Inject(ILogger) private _logger: ILogger
  ) {}

  get logger(): ILogger { return this._logger; }
  get config(): Config { return this._config; }

  static createApp(config: ConfigValue): Rupert {
    const injector = Injector.create([
      bind(Config).toFactory(() => new Config(config, process.argv)),
      bind(ILogger).toClass(Logger),
      bind(Rupert).toClass(Rupert)
    ]);

    return <Rupert>injector.get(Rupert);
  }
}
