/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import { expect } from 'chai';

import { Config } from './rupert';

describe('Rupert Configuration Manager', () => {
  it('should expose a constructor', () => {
    expect(Config).to.exist;
    expect(Config).to.be.instanceof(Function);
  });

  it('accepts a starting config block', () => {
    const conf = {
      shallow: 'value',
      deep: {
        path: 'value'
      }
    };
    const config = new Config(conf);
    expect(config.find('shallow')).to.equal('value');
    expect(config.find('deep.path')).to.equal('value');
  });

  describe('setting and retreiving values', () => {
    let config: Config = null;

    beforeEach(function(){
      config = new Config();
    });

    it('sets and finds key by shallow path', () => {
      config.set('shallow', 'value');
      expect(config.find('shallow')).to.equal('value');
    });

    it('sets and finds key by deep path', () => {
      config.set('deep.path', 'value');
      expect(config.find('deep.path')).to.equal('value');
    });

    it('sets and overrides', () => {
      config.set('deep.path', 'value');
      expect(config.find('deep.path')).to.equal('value');
      config.set('deep.path', 'new value');
      expect(config.find('deep.path')).to.equal('new value');
    });

    it('finds key with default value', () => {
      expect(config.find('deep.path', 'value')).to.equal('value');
      expect(config.find('deep.path', 'other value')).to.equal('value');
    });

    describe('works with the environment', () => {
      it('finds key with environment override', () => {
        process.env.DEEP_PATH = 'environment';
        expect(config.find('deep.path', 'DEEP_PATH', 'value'))
          .to.equal('environment');
        expect(config.find('deep.path', 'other value')).to.equal('environment');
      });

      it('overrides current value with environment', () => {
        process.env.DEEP_PATH = 'environment';
        config.set('deep.path', 'value');
        expect(config.find('deep.path', 'DEEP_PATH', 'value'))
          .to.equal('environment');
        expect(config.find('deep.path', 'value')).to.equal('environment');
      });
    });

    // describe('profives list operations', () => {
      // it 'find key that was set to `false`', ->
      //   config.shallow = false
      //   falsy = config.find('shallow', 'value')
      //   falsy.should.equal false # Passes
      //   # falsy.should.be.instanceof Boolean # fails?


      // it 'maps function over array key', ->
      //   Path = require('path')
      //   config.set('deep.path', ['./src', './lib'])
      //   list = config.map 'deep.path', (_)->
      // Path.resolve(Path.join('/var'), _)
      //   list.should.deep.equal ['/var/src', '/var/lib']

      // it 'appends values to key', ->
      //   config.set('deep.path', ['foo', 'bar'])
      //   config.append('deep.path', 'baz')
      //   config.append('deep.path', ['bing', 'bang'])
      //   config.find('deep.path').should.deep.equal([
      //     'foo', 'bar', 'baz', 'bing', 'bang'
      //   ])

      // it 'prepends values to key', ->
      //   config.set('deep.path', ['foo', 'bar'])
      //   config.prepend('deep.path', 'baz')
      //   config.prepend('deep.path', ['bing', 'bang'])
      //   config.find('deep.path').should.deep.equal([
      //     'bing', 'bang', 'baz', 'foo', 'bar'
      //   ])

      // it 'appends to a new empty array', ->
      //   config.append('deep.path', ['foo', 'bar'])
      //   config.find('deep.path').should.deep.equal(['foo', 'bar'])

      // it 'prepends to a new empty array', ->
      //   config.prepend('deep.path', ['foo', 'bar'])
      //   config.find('deep.path').should.deep.equal(['foo', 'bar'])

    // });
  });
});





