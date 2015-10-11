import {
  Rupert,
  Config,
  Inject,
  IPlugin,
  IPluginHandler,
  ILogger
} from '../rupert';

import * as express from 'express';

export class Static implements IPlugin {
  public handlers: IPluginHandler[] = [];
  ready(): Promise<void> { return Promise.resolve<void>(); }

  constructor(
    @Inject(Rupert) app: Rupert,
    @Inject(Config) config: Config,
    @Inject(ILogger) logger: ILogger
  ) {
    let statics = config.find<any>('static.routes', {});
    let staticOptions = {
      dotfiles: config.find<string>('static.dotfiles', 'ignore'),
      etag: config.find<boolean>('static.etag',	true),
      index: config.find<boolean|string|string[]>('static.index',	'index.html'),
      lastModified: config.find<boolean>('static.lastModified',	true),
      maxAge: config.find<number>('static.maxAge', 0),
      redirect: config.find<boolean>('static.redirect', true)
    };

    const roots = Object.keys(statics);
    logger.verbose(`Attaching ${roots.length} static handlers.`);

    roots.forEach((prefix) => {
      let path = config.find<string>(`static.routes.${prefix}`);
      logger.debug(`${prefix} => ${path}`);
      app.app.use(prefix, express.static(statics[prefix], staticOptions));
    });
  }
}
