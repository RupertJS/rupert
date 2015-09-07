export var Type = Function;

/**
 * Convenience to describe a constructor function.
 */
export type Constructor<T> = { new(...args: any[]): T };

export const UNDEFINED: any = void 0;

/**
 * Check if a variable is present (is not null or undefined)/
 */
export function isPresent(a: any): boolean {
  return a !== null && a !== UNDEFINED;
}
