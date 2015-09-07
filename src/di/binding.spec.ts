/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

import { expect } from 'chai';

import {
  Binding
} from './di';

describe('Rupert DI', function() {
  describe('Binding', function() {
    describe('toValue', function() {
      it('resolves correctly', function(){
        let binding = new Binding(Number, {toValue: 42});
        expect(binding.resolve().factory()).to.equal(42);
      });
    });

    describe('toClass', function() {
      it('resolves correctly', function(){
        class Vehicle {}
        let binding = new Binding(Vehicle, { toClass: Vehicle });
        expect(binding.resolve().factory()).to.be.instanceof(Vehicle);
      });
    });

    describe('toFactory', function() {
      it('resolves correctly', function() {
        let binding = new Binding(Number, { toFactory: () => 42 });
        expect(binding.resolve().factory()).to.equal(42);
      });
    });

    describe('dependencies', function(){
      let binding = new Binding(String, {
        toFactory: (value: Number) => { return 'Value: ' + value; },
        dependencies: [Number]
      });
      expect(binding.resolve().factory(3)).to.equal('Value: 3');
    });
  });
});
