'use strict';

var _ = require('lodash');
var logger = require('../../utils/logger');

var formatResults = function(results) {
  var output = '';

  _.each(results, function(errors, path) {
    output += path + '\n';

    errors.forEach(function(error) {
      output += '  ' + error + '\n';
    });

    output += '\n';
  });

  return '\n' + output.trim() + '\n';
};

var DefaultReporter = function() {
  this.output = function(results) {
    var errorPaths = _.keys(results).length;
    var lintProblems = _.flatten(_.values(results)).length;

    logger.print(formatResults(results));
    logger.print(' ✖ '+lintProblems+' problems ('+errorPaths+' file paths)\n');
  };
};

module.exports = new DefaultReporter();
