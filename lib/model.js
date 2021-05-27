'use strict';

const isClass = require('is-class');

/**
	 * Base class for RTF model entries.
	 *
	 * @class Model
	 */
class Model {
  /**
		 * Creates an instance of Model.
		 *
		 * @param {Model/null} parent
		 * @memberOf Model
		 */
  constructor(parent) {
    this.children = [];
    this._parent = parent || null;
  }

  append(node) {
    this.children.push(node);

    node.setParent(this);
  }

  setParent(parent) {
    this._parent = parent;
  }

  getParent() {
    return this._parent;
  }

  /**
		 * @returns {Model/null} Returns last child of this item or `null` if none.
		 * @memberOf Model
		 */
  getLast() {
    return this.children[ this.children.length - 1 ] || null;
  }

  /**
		 * @returns {Model/null} Returns last child of this item or `null` if none.
		 * @memberOf Model
		 */
  getFirst() {
    return this.getChild();
  }

  /**
		 * Returns the first child matching `criteria`.
		 *
		 *		// Returns a first child which is instance of Group.
		 *		curModel.getChild( Group );
		 *
		 * @param {Class/Function} [criteria] If no criteria is given the first child is returned.
		 * @param {Boolean} [recursive=false]
		 * @returns {Model}
		 * @memberOf Model
		 */
  getChild(criteria, recursive) {
    return this._getChildren(this, criteria, recursive).next().value || null;
  }

  /**
		 * Returns an array of children matching `criteria`.
		 *
		 *		// Returns a first child which is instance of Group.
		 *		curModel.getChild( Group );
		 *
		 * @param {Class/Function} [criteria] If no criteria is given the first child is returned.
		 * @param {Boolean} [recursive=false]
		 * @returns {Model[]}
		 * @memberOf Model
		 */
  getChildren(criteria, recursive) {
    let ret = [];

    for (let child of this._getChildren(this, criteria, recursive)) {
      ret.push(child);
    }

    return ret;
  }

  * _getChildren(parent, criteria, recursive) {
    let evaluator = this._getEvaluatorFromCriteria(criteria);

    for (let child of parent.children) {
      if (evaluator(child) === true) {
        yield child;
      }
      if (recursive) {
        yield * this._getChildren(child, criteria, recursive);
      }
    }
  }

  _getEvaluatorFromCriteria(criteria) {
    let evaluator;

    if (!criteria) {
      evaluator = () => true;
    } else if (isClass(criteria)) {
      evaluator = val => val instanceof criteria;
    } else if (typeof criteria === 'function') {
      evaluator = criteria;
    } else {
      evaluator = () => false;
    }

    return evaluator;
  }
}

class Text extends Model {
  constructor(parent) {
    super(parent);

    this.value = '';
  }

  /**
           * Adds `str` to the end of current text value.
           *
           * @param {String} str Text to be appended.
           * @memberOf Text
           */
  appendText(str) {
    this.value += str;
  }
}

class Group extends Model {}

class Document extends Model {}

class Command extends Model {
  constructor(parent) {
    super(parent);

    /**
			 * @property {String} name Name of the command.
			 * @memberOf Command
			 */
    this.name = '';
    this.value = '';
  }

  set value(val) {
    this._value = val;
    this.name = Command._resolveName(val) || '';
  }

  get value() {
    return this._value;
  }

  /**
		 * Returns command name picked from command token.
		 *
		 * E.g. for `"\foobar "` token it would return `"foobar"` string.
		 *
		 * @private
		 * @param {String} value Text value picked by parser.
		 * @returns {String/null}
		 * @memberOf Command
		 */
  static _resolveName(value) {
    let match = value.match(/\\([a-z]+(-?[0-9]+)?) ?/);

    return match ? match[ 1 ] : null;
  }
}

class Picture extends Command {
  /**
		 * Returns a buffer containing the image.
		 *
		 * @returns {Buffer}
		 * @memberOf Picture
		 */
  getPicture() {
    var input = this._getImageText(),
      inputLen = input.length,
      buffer = Buffer.alloc(inputLen / 2);

    for (var i = 0; i < inputLen; i += 2) {
      buffer.writeUInt8(
        parseInt(input.substr(i, 2), 16),
        i ? (i / 2) : 0
      );
    }

    return buffer;
  }

  /**
		 * Browser-friendly version of {@link #getPicture}.
		 *
		 * @returns {String} Returns picture data as a string.
		 * @memberOf Picture
		 */
  getPictureAsString() {
    var input = this._getImageText(),
      inputLen = input.length,
      ret = '',
      i;

    for (i = 0; i < inputLen; i += 2) {
      ret += String.fromCharCode(parseInt(input.substr(i, 2), 16));
    }
    return ret;
  }

  /**
		 * @returns {String} Mime type of the image, e.g. `image/png`.
		 * @memberOf Picture
		 */
  getType() {
    let blip = this.getParent().getChild(child => child instanceof Command && child.name.endsWith('blip'));

    if (blip) {
      return 'image/' + blip.name.replace('blip', '');
    }

    return 'image/bmp';
  }

  _getImageText() {
    return this.getParent().getChild(Text).value;
  }
}

module.exports = {
  command: {
    Picture
  },
  Command,
  Document,
  Group,
  Model,
  Text
};
