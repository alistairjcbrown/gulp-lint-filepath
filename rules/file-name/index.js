'use strict';

var _ = require('lodash');

module.exports = function(filePath, matchers) {
  var fileName = filePath.filename + filePath.extension;
  var errorResponse = 'Invalid file name "'+fileName+'"';

  if (filePath.isDirectory || !_.isArray(matchers)) {
    return;
  }

  var matchedExtension = _.any(matchers, function(matcher) {
    return _.isString(matcher) && matcher === fileName ||
           _.isRegExp(matcher) && matcher.test(fileName);
  });

  if (!matchedExtension || matchers.length === 0) {
    return errorResponse;
  }
};
