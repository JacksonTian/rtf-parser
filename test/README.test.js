'use strict';

const assert = require('assert');

const {parse, model} = require('../lib');

describe('README.md examples', () => {

  describe('parse example', () => {
    const doc = parse('{\\rtf1 foobar}');
    assert.ok(doc instanceof model.Document);
  });

});
