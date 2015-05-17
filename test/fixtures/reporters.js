'use strict';

var sinon = require('sinon');

var reporters = {
  default: sinon.stub().returns('default'),
  fail: sinon.stub().returns('fail')
};

reporters.default.output = sinon.stub().returns('default-output');
reporters.fail.output = sinon.stub().returns('fail-output');

module.exports = reporters;
