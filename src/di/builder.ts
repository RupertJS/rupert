import {Binding} from './binding';

import {Constructor} from './lang';

export function bind(type: any) {
  return {toValue: function<T>(toValue: T):
              Binding<T>{return new Binding<T>(type, {toValue});
}
, toFactory: function(toFactory: Function, dependencies: any[] = []):
      Binding<any> {
        return new Binding<any>(type, {toFactory, dependencies});
      },
    toClass: function<T>(toClass: Constructor<T>): Binding<T> {
  return new Binding<T>(type, {toClass});
}
}
;
}
