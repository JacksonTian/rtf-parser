
'use strict';

const Token = require('./Token');
const {model} = require('../');

class Group extends Token {
  constructor() {
    super();
    this.tokenRegexp = /\{/;
  }

  applyToModel(parent) {
    let group = new model.Group(parent);
    parent.append(group);
    return group;
  }
}

module.exports = Group;
