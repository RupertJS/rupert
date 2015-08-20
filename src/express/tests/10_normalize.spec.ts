/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai';

import { Config } from '../../config/config';
import { normalize } from '../10_normalize';
// function normalize(config: Config): Config { return config; }

describe('Normalize', function(){
  describe('root', function(){
    it('sets an implicit root', function(){
      const config = normalize(new Config());
      expect(config.find('root')).to.equal(process.cwd());
    });

    it('sets an explicit global root', function(){
      (<any>global).root = '/var/local/rupert';
      const config = normalize(new Config());
      expect(config.find('root')).to.equal('/var/local/rupert');
    });
  });

  describe('hostname', function(){
    it('takes a hostname from the os', function(){
      const config = normalize(new Config());
      expect(config.find('hostname')).to.equal(require('os').hostname());
    });

    it('takes a hostname from the environment', function(){
      process.env.HOST = 'thishost';
      const config = normalize(new Config());
      expect(config.find('hostname')).to.equal('thishost');
      delete process.env.HOST;
    });
  });
});