'use strict';

const assert = require('assert');
const path = require('path');
const fsp = require('fs').promises;

const rtf = require('../lib/index');

describe('rtf', () => {
  it('exposes model types', () => {
    assert.ok(rtf.model.Document instanceof Function);
    assert.ok(rtf.model.Command instanceof Function);
  });

  let simpleFixturePath = path.join(__dirname, '_fixtures', 'rtfSimple.rtf');
  it('resolves simple rtf', async () => {
    const content = await fsp.readFile(simpleFixturePath, {
      encoding: 'utf8'
    });
    const doc = rtf.parse(content);

    assert.ok(doc  instanceof  rtf.model.Document);
  });
});
