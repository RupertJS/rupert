# Rupert DI Design

Rupert Dependency Injection is a system for quick and easy DI across a Node
application. Inspired heavily by Angular 2, Rupert's DI API allows a variety
of straightforward injection patterns.

## Binding

A Binding describes a dependency resolution mechanism. Bindings allow the
Injector to go from an Injectable key to a run-time value. Broadly, there

* `toClass` - Multiple requests to the injector will get a new instance.
* `toAlias` - Multiple requests to the injector will get the same instance.
  ```
  class Vehicle {}
  class Car extends Vehicle {}
  var injectorClass = Injector.create([
    new Binding(Vehicle, { toClass: Car })
  ]);
  var injectorAlias = Injector.create([
    new Binding(Vehicle, { toAlias: Car })
  ]);
  expect(injectorClass.get(Vehicle)).not.toBe(injectorClass.get(Car));
  expect(injectorClass.get(Vehicle) instanceof Car).toBe(true);
  expect(injectorAlias.get(Vehicle)).toBe(injectorAlias.get(Car));
  expect(injectorAlias.get(Vehicle) instanceof Car).toBe(true);
  ```

* `toValue` - Bind to a simple, single value.
  ```
  var injector = Injector.create([
    new Binding(String, { toValue: 'Hello' })
  ]);
  expect(injector.get(String)).to.equal('Hello');
  ```

* `toFactory` - Bind to the result of a factory function.
  ```
  var injector = Injector.create([
    new Binding(Number, { toFactory: () => { return 1+2; }}),
    new Binding(String, { toFactory: (value) => { return "Value: " + value; },
                          dependencies: [Number] })
  ]);
  expect(injector.get(Number)).to.equal(3);
  expect(injector.get(String)).to.equal('Value: 3');
  ```

### Bindings Builder
An imperative form of the Binding configuration.

```
bind(Number).toFactory(()=>1+2);
bind(Value).toFactory((n)=>{"Value: " + n}, [Number]);
```

## Injector

The Injector is responsible for actually creating instances with dependency
resolution.

```
injector = Injector.create([Bindings...], parent?);
injector.create([Bindings...]) // Implicit child
injector.get(BindingKey) // Return an instance
```

## Annotations

### @Inject

The `@Inject` annotations marks a single parameter with an injection
dependency.

```
class Engine {}
class V8 extends Engine {
  public cylinders: number = 8;
}

class Car {
  constructor(
    @Inject(Engine) public engine: Engine
  ) {}
}

let injector = Injector.create([
  bind(Engine).toClass(V8),
  bind(Car).toClass(Car)
]);
expect(injector.get(Car).engine.cylinders).to.equal(8);
```
