# Rupert Logging

The Rupert logger is intended to be a simple "grab and go" logging interface.
The logger exposes several levels of logging verbosity, which can each take a
string message and an optional object of metadata. The logger is configured via
the Rupert Configuration utilities.

## Configuration

### `log.level`, `LOG_LEVEL`, `'http'`
The verbosity level to output at. Anything logged at this level or higher will
be written out. Levels are, from lowest to highest, `silly`, `data`, `debug`,
`verbose`, `http`, `log`, `warn`, `error`, and `silent`. See method comments in
ILogger for recommendations on how to use each level.

### `log.console`, `LOG_CONSOLE`, `false`
If set to `true`, will enable logging to stdout.

### `log.file`, `LOG_FILE`, `false`
If set to a `string`, will log to a file at that location. The directory must
exist, but the file will be created. The logfile will be rotated daily.

### `log.rotate`, `LOG_ROTATE`, `'.yyyy-MM-dd'`
The rotation suffix for log rotation. Uses patterns provided by [winston](1).
For example, `'.yyyy-MM-ddTHH'` would rotate every hour.

### `log.format`, `LOG_FORMAT`, `'tiny'`
The format to log HTTP requests. Uses the patterns provided by [morgan](2).

[1]: https://github.com/winstonjs/winston/blob/master/docs/transports.md#dailyrotatefile-transport
[2]: https://github.com/expressjs/morgan#predefined-formats
