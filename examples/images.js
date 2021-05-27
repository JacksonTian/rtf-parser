'use strict';

const path = require('path');
const fs = require('fs');

const { parse, model } = require('../lib');

// This example shows how to traverse the document, and work with pictures.
// It's loading RTF file pointed by `rtfPath` and saves each image to `outputPath` directory.

const rtfPath = path.join(__dirname, 'rtf', 'images.rtf'),
  ouputPath = './_output';

const content = fs.readFileSync(rtfPath, 'utf8');

const doc = parse(content);
// File parsed, doc is a Document instance.
// Now get all the picture instances:
let pics = doc.getChildren(model.command.Picture, true);

console.log(`Found ${pics.length} pictures, saving to ${ouputPath} directory...`);
// Save each picture as a file in the output directory.
for (let index = 0; index < pics.length; index++) {
  const pict = pics[index];
  let extension = pict.getType().split('/')[ 1 ];
  fs.writeFileSync(`_output/img${index}.${extension}`, pict.getPicture());
}

console.log('And I\'m done!');
