import {expect, spy} from '../util/specs';

import {ILogger, Logger} from './logger';

import {Config} from '../config/config';

describe('logger', function() {
  it('instantiates', function() {
    let winston = {
      Logger: spy(),
      transports: {Console: spy(), DailyRotateFile: spy()}
    };

    let morgan = spy();

    let logger: ILogger = new Logger(new Config({}), winston, morgan);

    expect(logger).to.exist;
    expect(winston.Logger).to.have.been.calledOnce;
    expect(winston.transports.Console).to.have.been.called;
    expect(winston.transports.DailyRotateFile).to.not.have.been.called;
    expect(morgan).to.have.been.calledWith('tiny');
  });

  it('configures', function() {
    const level = 'warn';
    const file = '/var/log/file';
    const format = 'combined';
    const rotate = '.yyyy-MM-ddTHH';

    let config = new Config({log: {level, file, format, rotate}});
    let winston = {
      Logger: spy(),
      transports: {Console: spy(), DailyRotateFile: spy()}
    };

    let morgan = spy();

    let logger: ILogger = new Logger(config, winston, <any>morgan);

    expect(logger).to.exist;
    expect(winston.transports.Console).to.have.been.calledOnce;
    expect(winston.transports.Console)
        .to.have.been.calledWith({level, timestamp: true, colorize: true});
    expect(winston.transports.DailyRotateFile).to.have.been.calledOnce;
    expect(winston.transports.DailyRotateFile)
        .to.have.been.calledWith({
          level,
          timestamp: true,
          datePattern: rotate,
          filename: file,
        });
    expect(winston.Logger).to.have.been.called;
    expect(morgan).to.have.been.calledWith(format);
  });

  it('logs', function() {
    const levels = [
      `silly`,
      `data`,
      `debug`,
      `verbose`,
      `http`,
      `log`,
      `warn`,
      `error`,
      `silent`
    ];

    const _logger = {log: spy()};

    const winston = {
      Logger: () => _logger,
      transports: {Console: spy(), DailyRotateFile: spy()}
    };

    const logger = new Logger(new Config(), winston);

    for (let i = 0, q = levels.length; i < q; i++) {
      let level = levels[i];
      logger[level](level, {});
      expect(_logger.log)
          .to.have.been.calledWith(level === 'log' ? 'info' : level, level, {});
    }
  });
});
