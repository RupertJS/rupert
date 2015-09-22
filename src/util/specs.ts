/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />
/// <reference path="../../typings/sinon-chai/sinon-chai.d.ts" />

/* tslint:disable */
let sinonChai = require('sinon-chai');
/* tslint:enable */

import * as chai from 'chai';
chai.use(sinonChai);

export { expect } from 'chai';
export { spy, mock, stub } from 'sinon';
