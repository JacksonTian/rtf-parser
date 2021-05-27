'use strict';

const path = require('path');
const assert = require('assert');

const { parse, model} = require('../lib/');

const { readFile } = require('fs').promises;

describe('Parser integration', () => {

  it('parses a very simple string', () => {
    const doc = parse('{\\rtf1 foobar\r\n{abcd}{ef}}');
    let docChildren = doc.children;
    assert.strictEqual(docChildren.length, 1);
    assert.ok(docChildren[0] instanceof model.Group);

    // Ensure that there's also a nested group.
    let grandChildren = doc.children[0].children;
    assert.strictEqual(grandChildren.length, 4);
    assert.ok(grandChildren[0] instanceof model.Command);
    assert.strictEqual(grandChildren[0].value, '\\rtf1 ');
    assert.ok(grandChildren[1] instanceof model.Text);
    assert.strictEqual(grandChildren[1].value, 'foobar');
    assert.ok(grandChildren[2] instanceof model.Group);
    assert.ok(grandChildren[3] instanceof model.Group);

    // Check one of nested groups.
    let nestedGroup = grandChildren[2].children;
    assert.strictEqual(nestedGroup.length, 1);
  });

  it('merges subsequent text entries', () => {
    const doc = parse('{two \r\n lines}');
    let group = doc.children[0];
    assert.strictEqual(group.children.length, 1);
    assert.ok(group.children[0] instanceof model.Text);
    assert.strictEqual(group.children[0].value, 'two  lines');
  });

  describe('pictures', () => {

    it('find images', async () => {
      const content = await readFile(path.join(__dirname, '_fixtures', 'extractedPngPicture.rtf'), {
        encoding: 'utf8'
      });
      const doc = parse(content);
      assert.ok(doc.getChild(model.command.Picture, true) instanceof model.command.Picture);
    });

    it('doesnt show images in nonshppict', async () => {
      const content = await readFile(path.join(__dirname, '_fixtures', 'extractedNonshppict.rtf'), {
        encoding: 'utf8'
      });
      const doc = parse(content);
      assert.ok(doc.getChild(model.command.Picture, true) === null);
    });
  });
});
