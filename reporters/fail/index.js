'use strict';

var _ = require('lodash');
var gutil = require('gulp-util');

var ErrorReporter = function() {
  this.output = function(results, gulp) {
    gulp.emit('error', new gutil.PluginError('gulp-lint-filepath', {
      message: 'FilePath linting failed for: ' + _.keys(results).join(', '),
      showStack: false
    }));
  };
};

module.exports = new ErrorReporter();
