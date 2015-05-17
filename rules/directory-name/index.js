'use strict';

var _ = require('lodash');

module.exports = function(filePath, matchers) {
  var errorResponse = 'Invalid directory name "'+filePath.filename+'"';

  if (!filePath.isDirectory || !_.isArray(matchers)) {
    return;
  }

  var matchedExtension = _.any(matchers, function(matcher) {
    return _.isString(matcher) && matcher === filePath.filename ||
           _.isRegExp(matcher) && matcher.test(filePath.filename);
  });

  if (!matchedExtension || matchers.length === 0) {
    return errorResponse;
  }
};
