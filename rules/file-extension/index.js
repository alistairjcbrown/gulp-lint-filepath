'use strict';

var _ = require('lodash');

module.exports = function(filePath, extensions) {
  var errorResponse = 'Unknown file extension "'+filePath.extension+'"';

  if (filePath.isDirectory || !_.isArray(extensions)) {
    return;
  }

  var matchedExtension = _.any(extensions, function(extension) {
    return _.isString(extension) && extension === filePath.extension ||
           _.isRegExp(extension) && extension.test(filePath.extension);
  });

  if (!matchedExtension || extensions.length === 0) {
    return errorResponse;
  }
};
