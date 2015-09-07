export var Type = Function;

export type Constructor<T> = { new(...args: any[]): T };
