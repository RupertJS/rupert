import {
  $injectionKey,
  Dependency
} from './dependency';

import {
  isPresent
} from './lang';

/**
 * The `Inject` annotation marks a constructor parameter for injection.
 */
export function Inject(type: any): ParameterDecorator {
  return function(target: Object, key: String|any, paramIndex: number) {
    target[$injectionKey] = target[$injectionKey] || [];
    target[$injectionKey][paramIndex] = type;
  };
}

export function Optional(): ParameterDecorator {
  return function(target: Object, key: String|any, paramIndex: number) {
    if (!isPresent(target[$injectionKey])) {
      throw new Error(`No injections for ${target}!`);
    }
    if (!isPresent(target[$injectionKey][paramIndex])) {
      throw new Error(
        `No injection at ${paramIndex} for ${stringify(target)}!`
      );
    }
    target[$injectionKey][paramIndex] = Dependency.ensureDependency(
      target[$injectionKey][paramIndex]
    );
    (<Dependency>target[$injectionKey][paramIndex]).optional = true;
  };
}

export function Lazy(): ParameterDecorator {
  return function(target: Object, key: String|any, paramIndex: number) {
    return target;
  };
}

function stringify(thing: any): string {
  let toStr: string[] = Object.toString.call(thing).split('\n');
  if (toStr.length === 1) {
    return toStr[1];
  } else {
    return toStr.slice(0, 1)[0].trim() + '...' +
      toStr.slice(toStr.length - 1)[0].trim();
  }
}
