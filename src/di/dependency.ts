import {
  Constructor
} from './lang';

export const $injectionKey = '__$INJECT__';

export class Dependency {
  static getAllFor<T>(t: Constructor<T>): Dependency[] {
    let deps = t[$injectionKey];
    if (!deps) {
      return [];
    }
    if (!Array.isArray(deps)) {
      throw new Error('When present, `$injectionKey` must be an array.');
    }
    let depsList: any[] = deps;
    return depsList.map(Dependency.ensureDependency);
  }

  static ensureDependency(d: any): Dependency {
    return d instanceof Dependency ? d : new Dependency(d);
  }

  constructor(
    public token: any
  ) {}
}
