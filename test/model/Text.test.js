'use strict';

const assert = require('assert');

const { model } = require('../../lib');

describe('model.Text', () => {
  let mock;

  beforeEach(() => {
    mock = new model.Text();
  });

  describe('appendText', () => {
    it('adds text', () => {
      mock.appendText('aa');
      mock.appendText('bb');
      mock.appendText('cc');
      assert.strictEqual(mock.value ,'aabbcc');
    });
  });
});
