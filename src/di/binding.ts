import {
  Constructor
} from './lang';

import {
  Dependency
} from './dependency';

export class Binding<T> {
  private toValue: any;
  private toClass: Constructor<T>;
  // private toAlias: Type;
  private toFactory: Function;
  private depenendies: any[];

  constructor(private _type: any, {
    toValue,
    toClass,
    toFactory,
    dependencies = []
  }: {
    toValue?: any,
    toClass?: Constructor<T>,
    toFactory?: Function,
    dependencies?: any[]
  } = {}) {
    this.toValue = toValue;
    this.toClass = toClass;
    this.toFactory = toFactory;
    this.depenendies = dependencies;
  }

  resolve(): ResolvedBinding {
    const type = this._type;
    let factory: Function;
    let deps: Dependency[];

    if (this.toClass) {
      factory = _getFactory(this.toClass);
      deps = Dependency.getAllFor(this.toClass);
    } else if (this.toFactory) {
      factory = this.toFactory;
      deps = this.depenendies.map((_) => new Dependency(_));
    } else {
      factory = () => this.toValue;
      deps = [];
    }
    return new ResolvedBinding(type, factory, deps);
  }
}

export class ResolvedBinding {
  constructor(
    public key: any,
    public factory: Function,
    public dependencies: Dependency[]
  ) { }
}

const UNDEFINED: any = void 0;
function isPresent(a: any): boolean {
  return a !== null && a !== UNDEFINED;
}

/* tslint:disable */
function _getFactory<T>(t: Constructor<T>): Function {
  if (!isPresent(t.length)) {
    return () => t;
  }
  switch (t.length) {
    case 0:
      return () => new t();
    case 1:
      return (a1: any) => new t(a1);
    case 2:
      return (a1: any, a2: any) => new t(a1, a2);
    case 3:
      return (a1: any, a2: any, a3: any) => new t(a1, a2, a3);
    case 4:
      return (a1: any, a2: any, a3: any, a4: any) => new t(a1, a2, a3, a4);
    case 5:
      return (a1: any, a2: any, a3: any, a4: any, a5: any) => new t(a1, a2, a3, a4, a5);
    case 6:
      return (a1: any, a2: any, a3: any, a4: any, a5: any, a6: any) => new t(a1, a2, a3, a4, a5, a6);
    case 7:
      return (a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any) => new t(a1, a2, a3, a4, a5, a6, a7);
    case 8:
      return (a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any) => new t(a1, a2, a3, a4, a5, a6, a7, a8);
    case 9:
      return (a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9);
  };
  throw new Error(`Cannot create a factory for '${t}' because its constructor has more than 9 arguments`);
}
/* tslint:enable */
