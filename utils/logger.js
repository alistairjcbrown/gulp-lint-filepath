'use strict';

var gutil = require('gulp-util');
var title = 'gulp-lint-filepath:';

var Logger = function(title) {
  this.error = function(msg) {
    gutil.log(title, 'Error: ' + msg);
  };

  this.warn = function(msg) {
    gutil.log(title, 'Warning: ' + msg);
  };

  this.log = function(msg) {
    gutil.log(title, msg);
  };

  this.print = function(msg) {
    console.log(msg);
  };
};

module.exports = new Logger(title);
