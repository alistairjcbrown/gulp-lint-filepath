'use strict';

var fs = require('fs');
var path = require('path');

var FilePath = function(filePath) {
  this.relative = path.dirname(path.relative(process.cwd(), filePath)),
  this.directory = path.dirname(filePath);
  this.extension = path.extname(filePath);
  this.filename = path.basename(filePath, this.extension);
  this.isDirectory = fs.statSync(filePath).isDirectory();
  this.value = filePath + (this.isDirectory ? '/' : '');
};

module.exports = FilePath;
