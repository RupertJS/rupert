/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

import { expect } from 'chai';

import {
  bind
} from './di';

describe('Rupert DI', function() {
  describe('Binding', function() {
    it('builds toValue', function() {
      let binding = bind(Number).toValue(3);
      expect(binding.resolve().factory()).to.equal(3);
    });
    it('builds toClass', function() {
      class Vehicle {}
      let binding = bind(Vehicle).toClass(Vehicle);
      expect(binding.resolve().factory()).to.be.instanceof(Vehicle);
    });
    it('builds toFactory', function() {
      let binding = bind(String).toFactory(
        (value: Number) => { return 'Value: ' + value; },
        [Number]
      );
      expect(binding.resolve().factory(3)).to.equal('Value: 3');
    });
  });
});
