'use strict';

const assert = require('assert');

const sinon = require('sinon');

const Group = require('../../../lib/token/Group');

describe('Group', () => {
  let mock = new Group();

  describe('constructor', () => {
    it('sets a proper regexp', () => {
      let ret = new Group();
      assert.ok(ret.tokenRegexp  instanceof  RegExp);
    });
  });

  describe('match', () => {
    it('matches regular group string at the beginning', () => {
      assert.strictEqual(mock.match('{{*generator Sample Rich Text Editor}viewkind4 pard Hello world!par}')).to.be.eql([0, '{']);
    });

    it('matches regular group string', () => {
      assert.strictEqual(mock.match('foo {{*generator Sample Rich Text Editor}viewkind4 pard Hello world!par}')).to.be.eql([4, '{']);
    });

    it('doesnt match regular text', () => {
      assert.strictEqual(mock.match('foo')).to.be.false;
    });
  });


  describe('applyToModel', () => {
    let fakeModel;

    const GroupModel = require('../../../lib/model/Group');

    beforeEach(() => {
      fakeModel = {
        append: sinon.stub()
      };
    });

    it('adds a new group context', () => {
      mock.applyToModel(fakeModel);
      assert.strictEqual(fakeModel.append).to.be.calledWith(sinon.match.instanceOf(GroupModel));
    });

    it('changes the context', () => {
      let ret = mock.applyToModel(fakeModel);
      assert.strictEqual(ret  instanceof  GroupModel);
    });
  });
});
