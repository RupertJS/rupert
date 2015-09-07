/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

import { expect } from 'chai';

import {
  Injector,
  Binding
} from './di';

describe('Rupert DI', function() {
  describe('Injector', function() {
    it('statically creates new injectors', function() {
      let injector = Injector.create([]);
      expect(injector).to.not.be.undefined;
    });

    it('retrieves simple values', function() {
      let injector = Injector.create(
        [ new Binding(Number, { toValue: 42 }) ]
      );
      expect(injector.get(Number)).to.equal(42);
    });

    it('instantiates classes and aliases', function(){
      class Vehicle {}
      class Car extends Vehicle {}
      var injectorClass = Injector.create([
        new Binding(Car, { toClass: Car }),
        new Binding(Vehicle, { toClass: Car })
      ]);
      // var injectorAlias = Injector.create([
      // new Binding(Car, { toClass: Car }),
      //   new Binding(Vehicle, { toAlias: Car })
      // ]);
      expect(injectorClass.get(Vehicle)).to.not.equal(injectorClass.get(Car));
      expect(injectorClass.get(Vehicle) instanceof Car).to.equal(true);
      // expect(injectorAlias.get(Vehicle)).to.not.equal(injectorAlias.get(Car));
      // expect(injectorAlias.get(Vehicle) instanceof Car).to.equal(true);
    });

    it('throws an exception retrieving unset values', function() {
      var injector = Injector.create([]);
      expect((() => injector.get(Number)))
        .to.throw(/Injector does not have type /);
    });
  });
});
