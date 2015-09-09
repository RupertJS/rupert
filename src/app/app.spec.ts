/// <reference path='../../typings/mocha/mocha.d.ts' />
/// <reference path='../../typings/chai/chai.d.ts' />

import { expect } from 'chai';

import {
  Rupert
} from '../rupert';

describe('Rupert App', function() {
  it('creates and injects a new Rupert app', function() {
    const app = Rupert.createApp({foo: 'bar'});
    expect(app.config.find('foo')).to.equal('bar');
  });
});
