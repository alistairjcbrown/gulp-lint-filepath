'use strict';

var _ = require('lodash');
var through = require('through2');

var check = require('./utils/check');
var logger = require('./utils/logger');
var FilePath = require('./utils/file-path');
var rules = require('./rules');
var reporters = require('./reporters');

var results = {};

/*
 *  addRules
 *
 *  Add custom rules to the rule list and enable in the rule options hash.
 */
var addRules = function(additionalRules, opts) {
  if (check(additionalRules).is('undefined')) {
    return true;
  }

  if (check(additionalRules).is.not('object')) {
    logger.warn('Provide an mapping of custom rules');
    return false;
  }

  _.each(additionalRules, function(rule, ruleName) {
    if (check(rule).is.not('function') || check(ruleName).is.not('string')) {
      logger.warn('Invalid custom rule provided');
      return;
    }

    rules[ruleName] = rule;
    opts[ruleName] = opts[ruleName] || true;
  });

  return true;
};

/*
 *  processFile
 *
 *  Run file path through each rule and combine linting results.
 */
var processFile = function (opts, file, encoding, callback) {
  var filePath = new FilePath(file.path);
  results[filePath.value] = results[filePath.value] || [];

  _.each(rules, function(rule, name) {
    var response;

    if (!opts[name]) {
      return;
    }

    response = rule(filePath, opts[name]);

    if (check(response).is('string')) {
      results[filePath.value].push(response);
    }
  });

  callback(null, file);
};

/*
 *  getFinalRuleData
 *
 *  Call `done` function on each rule to retrieve final linting data and
 *  combine with linting results.
 */
var getFinalRuleData = function(rules, data) {
  _.each(rules, function(rule) {
    var response;

    if (check(rule.done).is.not('function')) {
      return;
    }

    response = rule.done();

    if (check(response).is.not('lintResult')) {
      return;
    }

    _.each(response, function(doneResults, path) {
      if (check(data[path]).is('array')) {
        data[path] = data[path].concat(doneResults);
      } else {
        data[path] = doneResults;
      }
    });
  });

  return data;
};

/*
 *  compressResultData
 *
 *  Remove file paths without any linting errors from the overall linting results.
 */
var compressResultData = function(data) {
  return _.reduce(data, function(results, errors, filePath) {
    if (check(errors).is.not('empty')) {
      results[filePath] = errors;
    }
    return results;
  }, {});
};

/*
 *  compileResults
 *
 *  Get final linting errors and remove empty results.
 */
var compileResults = function(callback) {
  results = getFinalRuleData(rules, results);
  results = compressResultData(results);
  callback();
};

// ---

module.exports = function(opts, additionalRules) {
  results = {};
  addRules(additionalRules, opts);
  return through.obj(_.partial(processFile, opts), compileResults);
};

module.exports.reporter = function(chosenReporter) {
  var reporter = reporters.default;

  if (chosenReporter === 'fail') {
    reporter = reporters.fail;
  }

  if (check(chosenReporter).has('output') && check(chosenReporter.output).is('function')) {
    reporter = chosenReporter;
  }

  return through.obj(function(file, encoding, callback) {
    callback();
  }, function(callback) {
    if (check(results).is.not('empty')) {
      reporter.output(results, this);
    }
    callback();
  });
};
