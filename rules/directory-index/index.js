'use strict';

var _ = require('lodash');
var check = require('../../utils/check');

var directoryMap = {};

/*
 *  filePathCanBeIgnored
 *
 *  Check if file path can be ignored as needing to contain index file.
 */
var filePathCanBeIgnored = function(filePath, opts) {
  if (filePath.isDirectory) {
    return true;
  }

  if (!check(opts).has('ignore') || check(opts.ignore).is.not('array')) {
    return false;
  }

  return opts.ignore.some(function(directory) {
    return _.isString(directory) && directory === filePath.relative ||
           _.isRegExp(directory) && directory.test(filePath.relative);
  });

};

// ---

module.exports = function(filePath, opts) {
  if (filePathCanBeIgnored(filePath, opts)) {
    return;
  }

  if (check(directoryMap[filePath.directory]).is('undefined')) {
    directoryMap[filePath.directory] = false;
  }

  if (filePath.filename.match(/^index/i)) {
    directoryMap[filePath.directory] = true;
  }
};

module.exports.done = function() {
  var errorResponse = 'Missing index file';

  return _.reduce(directoryMap, function(result, hasIndex, directory) {
    if (hasIndex === false) {
      result[directory+'/'] = [ errorResponse ];
    }
    return result;
  }, {});
};

module.exports.__directoryMap = directoryMap;
