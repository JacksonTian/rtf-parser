'use strict';

const assert = require('assert');

const models = require('../../../lib/model');

describe('model.index', () => {

  it('exposes Mode types', () => {
    assert.ok(models instanceof Object);
    assert.ok(models.Document  instanceof  Function);
    assert.ok(models.Command  instanceof  Function);
    assert.ok(models.Group  instanceof  Function);
    assert.ok(models.command.Picture  instanceof  Function);
  });
});
