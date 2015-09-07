import {
  $injectionKey
} from './dependency';

export  function Inject(type: any): ParameterDecorator {
  return function(target: Object, key: String|any, paramIndex: number) {
    target[$injectionKey] = target[$injectionKey] || [];
    target[$injectionKey][paramIndex] = type;
  };
}
