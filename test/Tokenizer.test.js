'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Tokenizer = require('../lib/Tokenizer');

describe('Tokenizer', () => {
  let mock = new Tokenizer();

  it('has correct RTF_NEW_LINE', () => {
    assert.strictEqual(Tokenizer.RTF_NEW_LINE, '\r\n');
  });

  describe('splitRegExp', () => {
    it('splits multiline string', () => {
      let str = 'foo bar\r\nbaz\r\n\r\nboom';

      assert.deepStrictEqual(str.split(mock.splitRegExp), ['foo bar', 'baz', '', 'boom']);
    });
  });

  describe('process', () => {
    it('fires matched event', () => {
      let spy = sinon.spy();
      mock.on('matched', spy);
      mock.process('{\\rtf1 foobar}');
      assert.ok(spy.called);
    });

    it('returns an array', () => {
      let ret = mock.process('{\\rtf1 foobar}');
      assert.ok(Array.isArray(ret));
    });
  });
});
