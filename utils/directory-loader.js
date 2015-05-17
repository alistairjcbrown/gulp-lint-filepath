'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

// Pulling path from `module.parent` and clearing `require` cache
// taken from from node module `requireDir`.
// https://github.com/aseemk/requireDir
var callingModule = module.parent;
var callingDirectory = path.dirname(callingModule.filename);
delete require.cache[__filename];

var getDirectories = function(location) {
  return fs.readdirSync(location).filter(function(filePath) {
    return fs.statSync(path.resolve(location, filePath)).isDirectory();
  });
};

module.exports = {
  load: function(directory) {
    var fullPath;

    directory = directory || '.';
    fullPath = path.resolve(callingDirectory, directory);

    return _.reduce(getDirectories(fullPath), function(memo, moduleName) {
      memo[moduleName] = require(fullPath + '/'  + moduleName);
      return memo;
    }, {});
  }
};
