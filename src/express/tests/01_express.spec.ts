/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai';

import {default as Rupert, RupertServer} from '../01_express';

describe('Rupert Express Server', function(){
  it('exports a Rupert Server', function(){
    let rupert:RupertServer = Rupert();
  });
});
