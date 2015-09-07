/// <reference path='../../typings/mocha/mocha.d.ts' />
/// <reference path='../../typings/chai/chai.d.ts' />

import { expect } from 'chai';

import {
  Injector,
  Inject,
  Binding,
  bind,
  $injectionKey
} from './di';

describe('Dependency Injection', function() {
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

    describe('toFactory dependencies', function(){
      it('resolves correctly', function() {
        let binding = new Binding(String, {
          toFactory: (value: Number) => { return 'Value: ' + value; },
          dependencies: [Number]
        });
        expect(binding.resolve().factory(3)).to.equal('Value: 3');
      });
    });
  });

  // describe('Dependency', function() {
  // });

  describe('Binding Builder', function() {
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

    describe('classes and aliases', function() {
      class Vehicle {}
      class Car extends Vehicle {}
      it('instantiates classes', function(){
        let injectorClass = Injector.create([
          new Binding(Car, { toClass: Car }),
          new Binding(Vehicle, { toClass: Car })
        ]);
        expect(injectorClass.get(Vehicle)).to.not.equal(injectorClass.get(Car));
        expect(injectorClass.get(Vehicle) instanceof Car).to.equal(true);
      });

      it('instantiates classes with dependencies', function() {
        class Engine {
          constructor(public wheels: Number) {}
        }
        Engine[$injectionKey] = [Number];
        let injector = Injector.create([
          new Binding(Number, { toValue: 4 }),
          new Binding(Engine, { toClass: Engine })
        ]);
        expect((<Engine>injector.get(Engine)).wheels).to.equal(4);
      });

      // it('instantiates aliases as singletons', function() {
      //   let injectorAlias = Injector.create([
      //     new Binding(Car, { toClass: Car }),
      //     new Binding(Vehicle, { toAlias: Car })
      //   ]);
      //   expect(injectorAlias.get(Vehicle)).to.equal(injectorAlias.get(Car));
      //   expect(injectorAlias.get(Vehicle) instanceof Car).to.equal(true);
      // });
    });

    describe('factories', function(){
      it('executes a factory', function() {
        let injector = Injector.create([
          new Binding(Number, {
            toFactory: () => { return 1 + 2; }
          })
        ]);
        expect(injector.get(Number)).to.equal(3);
      });

      it('injects dependencies into a factory', function() {
        let injector = Injector.create([
          new Binding(Number, { toFactory: () => { return 1 + 2; } }),
          new Binding(String, {
            toFactory: (value: Number) => { return 'Value: ' + value; },
            dependencies: [Number]
          })
        ]);
        expect(injector.get(Number)).to.equal(3);
        expect(injector.get(String)).to.equal('Value: 3');
      });
    });

    it('throws an exception retrieving unbound values', function() {
      let injector = Injector.create([]);
      expect((() => injector.get(Number)))
        .to.throw(/Injector does not have type /);
    });
  });

  describe('Annotations', function() {
    it('attaches injection information', function() {
      class Engine {}
      class Vehicle {
        constructor(
          @Inject(Engine) private engine: Engine
        ) { }
      }
      expect(Vehicle[$injectionKey]).to.deep.equal([Engine]);
    });
  });
});
