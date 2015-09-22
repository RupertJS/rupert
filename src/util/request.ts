/// <reference path='../../typings/node/node.d.ts' />
/// <reference path='../../typings/supertest/supertest.d.ts' />
/// <reference path='../../typings/superagent/superagent.d.ts' />

import * as superagent from 'superagent';
import * as supertest from 'supertest';
import { DumbMap } from './dumbmap';

import { Rupert } from '../rupert';

const apps = new DumbMap<Rupert>();

export function requestApp(app: any): supertest.SuperTest {
  return supertest(app);
}

export function request(app: Rupert): Promise<IRupertTest> {
  const rupert = <Rupert>app;
  if (apps.has(rupert.url)) {
    throw new Error(
      `Rupert at ${rupert.url} is still running, did you remember to stop it?`
    );
  }

  return rupert.start().then(() => new Promise(
    (resolve: Function, reject: Function) => {
      apps.set(rupert.url, rupert);
      const test = <IRupertTest><any>supertest(rupert.url);
      resolve(test);
    }
  ))
  ;
}

export type CallbackHandler = { (err: any, res: supertest.Response): void; } |
  { (res: supertest.Response): void; };

export interface IRupertTest extends superagent.SuperAgent<ITest>{};

export interface ITest extends supertest.Test {
  expect(status: number, callback?: CallbackHandler): ITest;
  expect(status: number, body: string, callback?: CallbackHandler): ITest;
  expect(body: string, callback?: CallbackHandler): ITest;
  expect(body: RegExp, callback?: CallbackHandler): ITest;
  expect(body: Object, callback?: CallbackHandler): ITest;
  expect(field: string, val: string, callback?: CallbackHandler): ITest;
  expect(field: string, val: RegExp, callback?: CallbackHandler): ITest;
  expect(checker: (res: supertest.Response) => any): ITest;
  finish(cb?: (app?: Rupert) => void): void;
}

(<any>supertest).Test.prototype.finish = function(
  cb: (err?: any) => void
): void {
  if (!apps.has(this.app)) {
    throw new Error(`Rupert at ${this.app} seems to already be stopped...`);
  }

  const finalizer = (rupert: Rupert) => {
    apps.delete(rupert.url);
    cb();
  };

  apps.get(this.app).stop().then(finalizer).catch(cb);
};
