/// <reference path="../../typings/express/express.d.ts" />

import {
  Constructor
} from '../di/lang';

import { RequestHandler } from 'express';

export enum Methods {
  GET,
  POST,
  PUT,
  DELETE,
  PATCH
}

export interface IPluginHandler {
  route: string;
  methods: Methods[];
  handler: RequestHandler;
}

export interface IPlugin {
  handlers: IPluginHandler[];
}

// export type PluginList = IPlugin[];
export var PluginList: Constructor<IPlugin>[] = [];
