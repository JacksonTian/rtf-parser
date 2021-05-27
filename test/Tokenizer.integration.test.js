'use strict';

const fsp = require('fs').promises;
const path = require('path');

const assert = require('assert');

const Tokenizer = require('../lib/Tokenizer'),
  GroupToken = require('../lib/token/Group'),
  GroupEndToken = require('../lib/token/GroupEnd'),
  CommandToken = require('../lib/token/Command'),
  TextToken = require('../lib/token/Text'),
  EscapeToken = require('../lib/token/Escape');

describe('Tokenizer integration', () => {
  let mock;

  beforeEach(() => {
    mock = new Tokenizer();
  });

  /**
	 * Helper function to assert tokens returned by Tokenizer.
	 *
	 * @param {Array[]/Function[]} expected Either array of expected types, or array of arrays in format `[ <type>, <expectedStringValue> ]`.
	 * @param {Token[]} actual
	 */
  function assertParsedTokens(expected, actual) {
    if (!Array.isArray(expected)) {
      throw new TypeError('assertParsedTokens expects to get an array');
    }

    assert.strictEqual(actual.length, expected.length);

    for (let i = 0; i < expected.length; i++) {
      let curExpect = expected[ i ];

      if (typeof curExpect === 'function') {
        // Simply checking type.
        assert.ok(actual[ i ]  instanceof  curExpect);
      } else {
        // Array format.
        assert.ok(actual[ i ]  instanceof  curExpect[ 0 ]);
        assert.strictEqual(actual[ i ].value, curExpect[ 1 ]);
      }
    }
  }

  describe('process', () => {
    it('works with simple single-line markup', () => {
      let ret = mock.process('{\\rtf1 foobar}');

      assertParsedTokens([
        GroupToken, [CommandToken, '\\rtf1 '],
        [TextToken, 'foobar'],
        GroupEndToken
      ], ret);
    });

    it('works with multiline markup', () => {
      let ret = mock.process('{\\rtf1 foobar\r\n{abcd}}');

      assertParsedTokens([
        GroupToken, [CommandToken, '\\rtf1 '],
        [TextToken, 'foobar'],
        GroupToken, [TextToken, 'abcd'],
        GroupEndToken,
        GroupEndToken
      ], ret);
    });

    it('integrates well with escape tokens', () => {
      let ret = mock.process('{\\rtf1 foo\\}bar}');

      assertParsedTokens([
        GroupToken, [CommandToken, '\\rtf1 '],
        [TextToken, 'foo'],
        [EscapeToken, '\\}'],
        [TextToken, 'bar'],
        GroupEndToken
      ], ret);
    });

    it('doesnt crash with real rtfs', () => {
      return fsp.readFile(path.join(__dirname, '_fixtures', 'smallimage.rtf'))
        .then(content => mock.process(content))
        .then(results => {
          // Nothing crashed, yaaayy. Just make sure that some tokens were actually read.
          assert.ok(results.length > 0);
        });
    });
  });
});
