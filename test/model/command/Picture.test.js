'use strict';

const assert = require('assert');
const path = require('path');

const Picture = require('../../../../lib/model/command/Picture'),
  Group = require('../../../../lib/model/Group'),
  Text = require('../../../../lib/model/Text'),
  rtfParse = require('../../../../src'),
  fsp = require('fs-promise');

const SAMPLE_IMAGE = '0100090000036e00000000004500000000000400000003010800050000000b0200000000050000000c0203000' +
	'300030000001e000400000007010400040000000701040045000000410b2000cc00020002000000000002000200000000002800000' +
	'002000000020000000100040000000000000000000000000000000000000000000000000000000000ffffff000000ff00ff0000000' +
	'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000031010000020' +
	'2ffff040000002701ffff030000000000',
  fixturesPath = path.join(__dirname, '..', '..', '..', '_fixtures');

describe('Picture', () => {
  let parentGroup = new Group(),
    mock = new Picture(),
    text = new Text();

  parentGroup.append(mock);

  // Set the "stringified blob" of an image.
  text.value = SAMPLE_IMAGE;
  parentGroup.append(text);

  describe('getType', () => {
    // Unfortunately to test it conveniently we need to parse strings, so it's more of an integration test.
    let parse = rtfString => {
      return rtfParse.parseString(rtfString)
        .then(doc => doc.getChild(Picture, true));
    };

    it('returns correct type', () => {
      assert.strictEqual(mock.getType()).to.be.a('string');
    });

    it('defaults to a correct value', () => {
      return parse('{\\pict {}}')
        .then(pict => {
          assert.strictEqual(pict.getType() ,'image/bmp');
        });
    });

    it('detects png files', () => {
      return fsp.readFile(path.join(fixturesPath, 'extractedPngPicture.rtf'))
        .then(content => parse(content))
        .then(pict => {
          assert.strictEqual(pict.getType() ,'image/png');
        });
    });

    it('detects jpg files', () => {
      return parse('{\\pict\\picscalex32\\picscaley32\\piccropl0\\piccropr0\\piccropt0\\piccropb0' +
					'\\picw50800\\pich34581\\picwgoal28800\\pichgoal19605\\jpegblip\\bliptag-2021094954' +
					'{\\*\\blipuid 878889d6ffafd084e3430f9960d44e4c}}')
        .then(pict => {
          assert.strictEqual(pict.getType() ,'image/jpeg');
        });
    });
  });


  describe('getPicture', () => {
    it('works', () => {
      let imageBytes = mock.getPicture();

      assert.strictEqual(imageBytes[ 0 ], 'byte at 0 offset').to.be.eql(1);
      assert.strictEqual(imageBytes[ 1 ], 'byte at 1 offset').to.be.eql(0);
    });
  });

  describe('getPictureAsString', () => {
    it('works', () => {
      let stringified = mock.getPictureAsString();

      assert.strictEqual(stringified[ 2 ] ,'\t', '2nd character value');
      assert.strictEqual(stringified[ 6 ] ,'n', '6th character value');
      assert.strictEqual(stringified[ 12 ] ,'E', '12th character value');
    });
  });

  describe('_getImageText', () => {
    it('works', () => {
      assert.strictEqual(mock._getImageText() ,SAMPLE_IMAGE);
    });
  });
});
