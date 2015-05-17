'use strict';

var _ = require('lodash');
var check = require('check-type');

check.init(_);

check.init({
  isLintResult: function(value) {
    return check(value).is('object') && check(value).is.not('array') &&
      _.every(value, function(result, path) {
        return check(path).is('string') && check(result).is('arrayOfString');
      });
  },

  isArrayOfString: function(value) {
    if (check(value).is.not('array')) {
      return false;
    }
    return _.every(value, _.isString);
  }
});

module.exports = check;
