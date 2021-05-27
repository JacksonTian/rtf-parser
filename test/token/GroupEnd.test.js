'use strict';

const assert = require('assert');

const GroupEnd = require('../../../lib/token/GroupEnd');

describe('GroupEnd', () => {
  let mock = new GroupEnd();

  describe('constructor', () => {
    it('sets a proper regexp', () => {
      let ret = new GroupEnd();
      assert.strictEqual(ret.tokenRegexp  instanceof  RegExp);
    });
  });

  describe('match', () => {
    it('matches regular group on the end of string', () => {
      assert.strictEqual(mock.match('\\viewkind4 \\pard Hello world!\\par}')).to.be.eql([33, '}']);
    });

    it('matches group end on the beginning of the string', () => {
      assert.strictEqual(mock.match('} foo bar')).to.be.eql([0, '}']);
    });

    it('doesnt match regular text', () => {
      assert.strictEqual(mock.match('Hello world!par')).to.be.false;
    });
  });
});
