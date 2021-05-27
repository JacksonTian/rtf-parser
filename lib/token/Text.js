
'use strict';

const Token = require('./Token');
const model = require('../model');

/**
 * Text Text.
 *
 * @class Text
 * @abstract
 */
class Text extends Token {
  constructor(value) {
    super();
    this.value = value;
  }

  /**
		 * Checks if Text occurs at the beginning of `code`
		 *
		 * @param {String} code
		 * @returns {Boolean}
		 * @memberOf Text
		 */
  match(code) {
    // Text always matches.
    return true;
  }

  applyToModel(m) {
    let lastModelChild = m.getLast(),
      text;

    if (lastModelChild && lastModelChild instanceof model.Text) {
      // Current scope has already tailing text, we could merge it. (#6)
      text = lastModelChild;
    } else {
      text = new model.Text(m);
      m.append(text);
    }

    text.appendText(this.value);
  }
}

module.exports = Text;
