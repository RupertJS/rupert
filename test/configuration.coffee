should = require('chai').should()

Config = require('../src/config')

describe 'Rupert Configuration Manager', ->
  config = null
  beforeEach ->
    config = new Config()

  it 'exposes a constructor', ->
    should.exist Config
    Config.should.be.instanceof Function

  it 'accepts a starting config block', ->
    conf =
      shallow: 'value'
      deep:
        path: 'value'
    config = new Config conf
    config.shallow.should.equal 'value'
    config.deep.path.should.equal 'value'
    config.find('shallow').should.equal 'value'
    config.find('deep.path').should.equal 'value'

  it 'sets key by shallow path', ->
    config.set 'shallow', 'value'
    # config.options.shallow.should.equal 'value'
    config.shallow.should.equal 'value'

  it 'sets key by deep path', ->
    config.set 'deep.path', 'value'
    # config.options.deep.path.should.equal 'value'
    config.deep.path.should.equal 'value'

  it 'sets and overrides', ->
    config.set 'deep.path', 'value'
    config.set 'deep.path', 'new value'
    # config.options.deep.path.should.equal 'new value'
    config.deep.path.should.equal 'new value'

  it 'finds key by shallow path', ->
    config.set 'shallow', 'value'
    config.find('shallow').should.equal 'value'

  it 'finds key by deep path', ->
    config.set 'deep.path', 'value'
    config.find('deep.path').should.equal 'value'

  it 'finds key with default value', ->
    # should.not.exist config.options.deep
    should.not.exist config.deep
    config.find('deep.path', 'value').should.equal 'value'
    # config.options.deep.path.should.equal 'value'
    config.deep.path.should.equal 'value'
    config.find('deep.path', 'other value').should.equal 'value'

  it 'finds key with existing value', ->
    config.deep = {path: 'value'}
    config.find('deep.path', 'other value').should.equal 'value'

  it 'find key that was set to `false`', ->
    config.shallow = false
    config.find('shallow', 'value').should.equal false

  it 'finds key with environment override', ->
    process.env.DEEP_PATH = 'environment'
    config.find('deep.path', 'DEEP_PATH', 'value').should.equal 'environment'
    config.find('deep.path', 'other value').should.equal 'environment'

  it 'overrides current value with environment', ->
    process.env.DEEP_PATH = 'environment'
    config.set('deep.path', 'value')
    config.find('deep.path', 'DEEP_PATH', 'value').should.equal 'environment'
    config.find('deep.path', 'value').should.equal 'environment'

  it 'maps function over array key', ->
    Path = require('path')
    config.set('deep.path', ['./src', './lib'])
    list = config.map 'deep.path', (_)->Path.resolve(Path.join('/var'), _)
    list.should.deep.equal ['/var/src', '/var/lib']

  it 'appends values to key', ->
    config.set('deep.path', ['foo', 'bar'])
    config.append('deep.path', 'baz')
    config.append('deep.path', ['bing', 'bang'])
    config.find('deep.path').should.deep.equal([
      'foo', 'bar', 'baz', 'bing', 'bang'
    ])

  it 'prepends values to key', ->
    config.set('deep.path', ['foo', 'bar'])
    config.prepend('deep.path', 'baz')
    config.prepend('deep.path', ['bing', 'bang'])
    config.find('deep.path').should.deep.equal([
      'bing', 'bang', 'baz', 'foo', 'bar'
    ])

  it 'appends to a new empty array', ->
    config.append('deep.path', ['foo', 'bar'])
    config.find('deep.path').should.deep.equal(['foo', 'bar'])

  it 'prepends to a new empty array', ->
    config.prepend('deep.path', ['foo', 'bar'])
    config.find('deep.path').should.deep.equal(['foo', 'bar'])
