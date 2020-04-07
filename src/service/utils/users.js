const { applySpec, compose, prop, path, merge, dissocPath, tap } = require('ramda');
const config = require('config');

const { logger } = require('../../lib');

const sensitiveKeys = ['__v', '_id'];
const sensitiveKeysExclusionString = '-__v';

module.exports = {
  sensitiveKeys,
  sensitiveKeysExclusionString
};