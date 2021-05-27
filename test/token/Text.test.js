'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Text = require('../../lib/token/Text');
const model = require('../model');

describe('Text', () => {
  let mock;

  beforeEach(() => {
    mock = new Text();
  });

  describe('match', () => {
    it('always return correct val', () => {
      assert.strictEqual(mock.match('')).to.be.true;
      assert.strictEqual(mock.match('abc')).to.be.true;
    });
  });

  describe('applyToModel', () => {
    let fakeModel;

    beforeEach(() => {
      fakeModel = {
        append: sinon.stub(),
        getLast: sinon.stub()
      };
    });

    it('adds a new Text entry', () => {
      mock.value = 'abcd';
      mock.applyToModel(fakeModel);
      assert.strictEqual(fakeModel.append).to.be.calledWith(sinon.match.instanceOf(model.Text));
      let textEntry = fakeModel.append.args[ 0 ][ 0 ];
      assert.strictEqual(textEntry.value ,'abcd');
    });
  });
});
