'use strict';

const path = require('path');
const assert = require('assert');
const fsp = require('fs').promises;

const { parse, model } = require('../lib');

describe('Parser', () => {
  let simpleFixturePath = path.join(__dirname, '_fixtures', 'rtfSimple.rtf');

  describe('parse', () => {

    it('resolves simple rtf', async () => {
      const content = await fsp.readFile(simpleFixturePath, {
        encoding: 'utf8'
      });
      const doc = parse(content);

      assert.ok(doc  instanceof  model.Document);
    });

  });

});
