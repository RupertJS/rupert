# Rupert Configuration

The Rupert Configuration object quickly and easily allows plugins to have a
centralized user configuration setup that allows program, application, command
line, and environment-supplied default values. The configuration is a key/value
store with dot-separated paths through a hierarchical tree. When requesting
configuration keys, a program can supply the path to find the setting, a key
to look up values from the environment, and a default value. When creating a
new configuration, an application can provide an object with the app's starting
settings.

## Usage Example

### `command line invocation`
```
HTTP_PORT=8088 node app --deep.thought="Wherefore art thou, Romeo?"
```

### `app.ts`
```
import { Config } from 'rupert';

let config = new Config({
  setting: 47
}, process.argv);

config.find('setting', 42); // Returns 47
config.find('deep.thought', 'To be or not to be'); // Returns 'Wherefor art thou, Romeo'

config.find('http.port', 'HTTP_PORT', 8080); // Returns 8088
```

## List features

Especially when dealing with directories, it can be very useful to work on
lists of configuration data. Rupert configurations offers three operations,
`append`, `prepend`, and `map` to streamline these workflows. Lists are keys of
the configuration tree, so it is not possible to add an object or `config.find`
within a list; indeed, the only legal values are `string`s. `append` and
`prepend` expect a list of strings at the key, and will either insert single
values or concatenate arrays into the correct part of the target list. `map`
will execute a function from string to string on every element of the array,
storing the resulting values.
