/// <reference path="../../typings/express/express.d.ts" />

import {
  Constructor
} from '../di/lang';

import { RequestHandler, Request, Response } from 'express';

export enum Methods {
  ALL,
  GET,
  POST,
  PUT,
  DELETE,
  PATCH,
  HEAD,
  OPTION
}

export interface IPluginHandler {
  route: string;
  methods: Methods[];
  handler: RequestHandler;
}

export interface IPlugin {
  handlers: IPluginHandler[];
}

export const RupertRouting = '__RupertRouting__';

export interface IRoute {
  (route: string, properties: {methods: Methods[]}): MethodDecorator;
  prefix: (prefix: string) => ClassDecorator;
  POST: (route: string) => MethodDecorator;
  GET: (route: string) => MethodDecorator;
  PUT: (route: string) => MethodDecorator;
  HEAD: (route: string) => MethodDecorator;
}

export let Route = <IRoute>function(
  route: string,
  properties: {methods: Methods[]}
): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<RequestHandler>
  ): TypedPropertyDescriptor<RequestHandler> {
    (target.$$protoHandlers = target.$$protoHandlers || []).push({
      route,
      methods: properties.methods,
      handler: descriptor.value
    });

    return descriptor;
  };
};

Route.prefix = function(prefix: string) {
  return function<TFunction extends Function>(clazz: TFunction): TFunction {
    (<any>clazz).$$prefix = prefix;
    return clazz;
  };
};

Route.POST = function(route: string) {
  return Route(route, {methods: [Methods.POST]});
};
Route.GET = function (route: string) {
  return Route(route, {methods: [Methods.GET]});
};
Route.PUT = function (route: string) {
  return Route(route, {methods: [Methods.PUT]});
};
Route.HEAD = function (route: string) {
  return Route(route, {methods: [Methods.HEAD]});
};

export class RupertPlugin implements IPlugin {
  public handlers: IPluginHandler[];
  constructor() {
    let self = this;
    let prefix: string = (<any>this.constructor).$$prefix || '';
    let protoHandlers: IPluginHandler[] = (<any>this).$$protoHandlers || [];
    this.handlers = protoHandlers.map((_: IPluginHandler) => {
      let method = _.handler;
      // Add any ctor prefix
      _.route = prefix + _.route;
      // Rebind the handler to use the correct `this` context.
      _.handler = function(q: Request, s: Response, n: (err?: any) => void) {
        method.call(self, q, s, n);
      };
      return _;
    });
  }
}

// export type PluginList = IPlugin[];
export var PluginList: Constructor<IPlugin>[] = [];
