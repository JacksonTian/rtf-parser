'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Model = require('../../../lib/model/Model');

describe('Model', () => {
  class ModelA extends Model {}
  class ModelB extends Model {}

  let mock;

  beforeEach(() => {
    mock = new Model();
  });

  describe('constructor', () => {
    it('sets proper values', () => {
      let parent = {
          foo: 1
        },
        ret = new Model(parent);

      assert.strictEqual(ret._parent ,parent);
      assert.strictEqual(ret.children).to.be.an('array');
      assert.strictEqual(ret.children).to.be.eql([]);
    });
  });

  describe('append', () => {
    let getChildMock = () => ({
      setParent: sinon.stub()
    });

    it('appends a child', () => {
      let child1 = getChildMock(),
        child2 = getChildMock();

      mock.append(child1);
      mock.append(child2);

      assert.strictEqual(mock.children).to.be.eql([child1, child2]);
    });

    it('sets parent', () => {
      let child = getChildMock();

      mock.append(child);

      assert.strictEqual(child.setParent).to.be.calledWith(mock);
    });
  });

  describe('setParent', () => {
    it('changes the parent', () => {
      mock._parent = 1;

      mock.setParent(2);

      assert.strictEqual(mock._parent ,2);
    });
  });

  describe('getParent', () => {
    it('returns the parent', () => {
      mock._parent = 1;
      assert.strictEqual(mock.getParent() ,1);
      mock._parent = 2;
      assert.strictEqual(mock.getParent() ,2);
    });
  });

  describe('getLast', () => {
    it('returns null if none available', () => {
      assert.strictEqual(mock.getLast()).to.be.null;
    });

    it('returns last child', () => {
      mock.children = [1, 2, 3];
      assert.strictEqual(mock.getLast() ,3);
    });
  });


  describe('traversing methods', () => {
    let a = new ModelA(),
      b = new ModelB(),
      b2 = new ModelB(),
      nestedModel = new ModelB(),
      deepNestedModel = new ModelA(),
      emptyMock = new Model();



    before(() => {
      b2.foo = true;
      nestedModel.value = 'bom';
      b.append(nestedModel);
      deepNestedModel.value = 'deep';
      nestedModel.append(deepNestedModel);
    });

    beforeEach(() => {
      mock.append(a);
      mock.append(b);
      mock.append(b2);
    });

    describe('getChild', () => {
      describe('regular', () => {
        it('gives correct result no criteria is given', () => {
          assert.strictEqual(mock.getChild() ,a);
        });

        it('returns correct val when no children available', () => {
          assert.strictEqual(emptyMock.getChild()).to.be.null;
        });

        it('returns correct val when invalid argument given', () => {
          assert.strictEqual(mock.getChild({
            aa: 1
          })).to.be.null;
        });

        it('returns a correct val with a given type', () => {
          assert.strictEqual(mock.getChild(ModelB) ,b);
        });

        it('returns a correct val when given a function', () => {
          assert.strictEqual(mock.getChild(model => model.foo && model.foo === true) ,b2);
        });
      });

      describe('recursive', () => {
        it('returns a correct val when given a function', () => {
          assert.strictEqual(mock.getChild(model => model.value === 'bom', true) ,nestedModel);
        });

        it('returns deeply nested child', () => {
          assert.strictEqual(mock.getChild(model => model.value === 'deep', true) ,deepNestedModel);
        });
      });
    });

    describe('getChildren', () => {
      describe('regular', () => {
        it('gives correct result no criteria is given', () => {
          assert.strictEqual(mock.getChildren()).to.be.eql([a, b, b2]);
        });

        it('returns correct val when no children available', () => {
          assert.strictEqual(emptyMock.getChildren()).to.be.eql([]);
        });

        it('returns a correct val with a given type', () => {
          assert.strictEqual(mock.getChildren(ModelB)).to.be.eql([b, b2]);
        });

        it('returns a correct val when given a function', () => {
          assert.strictEqual(mock.getChildren(model => model.foo && model.foo === true)).to.be.eql([b2]);
        });
      });

      describe('recursive', () => {
        it('returns a correct val when given a function', () => {
          assert.strictEqual(mock.getChildren(model => model.value === 'bom', true)).to.be.eql([nestedModel]);
        });

        it('returns a correct val when given a class', () => {
          assert.strictEqual(mock.getChildren(ModelB, true)).to.be.eql([b, nestedModel, b2]);
        });

        it('returns a correct val when given a function but no match', () => {
          assert.strictEqual(mock.getChild(model => false, true)).to.be.null;
        });
      });
    });


    describe('getFirst', () => {
      it('returns correct val for non empty', () => {
        assert.strictEqual(mock.getFirst() ,a);

      });

      it('returns correct val for empty', () => {
        assert.strictEqual(emptyMock.getFirst()).to.be.null;
      });
    });

  });

});
