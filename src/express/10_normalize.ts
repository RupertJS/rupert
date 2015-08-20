/// <reference path="../../typings/node/node.d.ts" />

import { Config } from '../config/config';
import * as Path from 'path';

export function normalize(config: Config): Config {
  global.root
  const root = config.find('root',
    typeof global.root === 'string' ?
    '' + global.root :
    process.cwd());

  config.find('hostname', 'HOST', require('os').hostname());

  return config;
}
