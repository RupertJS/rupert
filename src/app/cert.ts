import {
  readFileSync  // , writeFileSync
} from 'fs';

import {ILogger} from '../logger/logger';

export function makeCert(keyFile: string, certFile: string, writeCert: boolean,
                         validDays: number,
                         logger: ILogger): {key: string, cert: string} {
  let key: string, cert: string;

  try {
    key = readFileSync(keyFile, 'utf-8');
    cert = readFileSync(certFile, 'utf-8');
  } catch (exception) {
    logger.error('Trying to start tls server, but no cert found!');
    // logger.info('Creating 1-day temporary cert.');
    throw exception;

    // const pemOpts = {validDays, selfSigned: true};
    // // {key, cert} = pemCreateCertificateSync(pemOpts);

    // if (writeCert) {
    //   logger.info(`Cert generated, writing to #{keyFile}, #{certFile}.`);
    //   writeFileSync(keyFile, key, 'utf-8');
    //   writeFileSync(keyFile, cert, 'utf-8');
    // }
  }

  return {key, cert};
}
