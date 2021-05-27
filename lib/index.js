'use strict';

const { Document } = require('./model');
const Tokenizer = require('./Tokenizer');

exports.parse = function (str) {
  let doc = new Document(),
    tokenizer = new Tokenizer(),
    modelContext = doc;

  tokenizer.on('matched', token => {
    modelContext = token.applyToModel(modelContext) || modelContext;
  });

  tokenizer.process(str);
  return doc;
};

exports.model = require('./model');
