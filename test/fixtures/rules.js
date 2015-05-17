'use strict';

var sinon = require('sinon');

var rules = {
  mockRule1: sinon.stub().returns('mock-rule-1'),
  mockRule2: sinon.stub().returns('mock-rule-2'),
  mockRule3: sinon.stub().returns('mock-rule-3')
};

rules.mockRule1.done = sinon.stub().returns('mock-rule-1-done');
rules.mockRule2.done = sinon.stub().returns('mock-rule-2-done');
rules.mockRule3.done = sinon.stub().returns('mock-rule-3-done');

module.exports = rules;
