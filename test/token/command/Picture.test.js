'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Picture = require('../../../../lib/token/command/Picture');

describe('Picture', () => {
  let mock = new Picture();

  describe('match', () => {
    it('matches a standalone pict', () => {
      assert.strictEqual(mock.match('{\\pict {}}')).to.be.eql([1, '\\pict ']);
    });
  });

  describe('applyToModel', () => {
    let fakeModel;

    const PictureModel = require('../../../../lib/model/command/Picture'),
      CommandModel = require('../../../../lib/model/Command');

    beforeEach(() => {
      fakeModel = {
        getParent: sinon.stub().returns(),
        append: sinon.stub(),
        getChild: sinon.stub()
      };
    });

    it('adds a new Picture when parent doesnt have nonshppict', () => {
      mock.applyToModel(fakeModel);
      assert.strictEqual(fakeModel.append).to.be.calledWith(sinon.match.instanceOf(PictureModel));
    });

    it('adds a Command instance when parent have nonshppict', () => {
      fakeModel.getParent = sinon.stub().returns({
        getChild: sinon.stub().returns({})
      });

      mock.applyToModel(fakeModel);

      assert.strictEqual(fakeModel.append).not.to.be.calledWith(sinon.match.instanceOf(PictureModel));
      assert.strictEqual(fakeModel.append).to.be.calledWith(sinon.match.instanceOf(CommandModel));
    });
  });
});
