'use strict';

const assert = require('assert');

const Command = require('../../../lib/model/Command');

describe('Command', () => {
  let mock;

  beforeEach(() => {
    mock = new Command();
  });

  describe('value setter', () => {
    it('sets name correctly', () => {
      mock.value = '\\foo123 ';
      assert.strictEqual(mock.name ,'foo123');

      mock.value = '\\a';
      assert.strictEqual(mock.name ,'a');
    });
  });

  describe('value getter', () => {
    it('returns correct value', () => {
      mock.value = 'aa';
      assert.strictEqual(mock.value ,'aa');

    });
  });
});
