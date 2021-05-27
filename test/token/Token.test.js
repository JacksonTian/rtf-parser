'use strict';

const assert = require('assert');

const Token = require('../../../lib/token/Token');

describe('Token', () => {
  class TokenSubclass extends Token {
    constructor() {
      super();
      this.tokenRegexp = /abc/;
    }
  }

  class NoRegexpToken extends Token {}

  describe('match', () => {
    it('throw an error if no tokenRegexp is provided', () => {
      assert.strictEqual(() => new NoRegexpToken().match('abcde')).to.throw(EvalError, 'Missing tokenRegexp');
    });

    it('matches correctly with valid regexp', () => {
      assert.strictEqual(new TokenSubclass().match('abcde')).to.be.eql([0, 'abc']);
      assert.strictEqual(new TokenSubclass().match('aaabc')).to.be.eql([2, 'abc']);
      assert.strictEqual(new TokenSubclass().match('foobar')).to.be.false;
      assert.strictEqual(new TokenSubclass().match(' abcde')).to.be.eql([1, 'abc']);
    });
  });


  describe('virtual methods', () => {
    assert.strictEqual(() => Token.prototype.applyToModel.call(null)).to.throw(Error, 'Method not implemented!');
  });
});
