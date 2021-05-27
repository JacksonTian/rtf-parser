'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Command = require('../../../lib/token/Command'),
  CommandModel = require('../../../lib/model/Command');

describe('Command', () => {
  let mock;

  beforeEach(() => {
    mock = new Command();
  });

  describe('match', () => {
    it('matches in the middle of the string', () => {
      assert.strictEqual(mock.match('foo \\pard bar')).to.be.eql([4, '\\pard ']);
    });

    it('matches at the beginning of the string', () => {
      assert.strictEqual(mock.match('\\abc123 bar')).to.be.eql([0, '\\abc123 ']);
    });
  });


  describe('applyToModel', () => {
    let fakeModel;

    beforeEach(() => {
      fakeModel = {
        append: sinon.stub()
      };
    });

    it('adds a command', () => {
      mock.value = '\\foo123';
      mock.applyToModel(fakeModel);
      assert.strictEqual(fakeModel.append).to.be.calledWith(sinon.match.instanceOf(CommandModel));
      let textEntry = fakeModel.append.args[ 0 ][ 0 ];
      assert.strictEqual(textEntry.value ,'\\foo123');
    });
  });
});
