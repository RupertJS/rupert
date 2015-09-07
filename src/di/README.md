# Rupert DI Design

Rupert Dependency Injection is meant as a system to allow quick and easy DI
across an entire Node application.

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
### @Injectable
