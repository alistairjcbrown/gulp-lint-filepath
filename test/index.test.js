'use strict';

var sinon = require('sinon');
require('jasmine-expect');
require('jasmine-sinon');

var _ = require('lodash');
var proxyquire = require('proxyquire');
var through2StreamMock = require('./fixtures/through2-stream');
var reportersMock = require('./fixtures/reporters');
var filePathMock = require('./fixtures/file-path');
var rulesMock = require('./fixtures/rules');

var lintFilepath = proxyquire('../index', {
  'through2': through2StreamMock,
  './reporters': reportersMock,
  './rules': rulesMock,
  './utils/file-path': function() {
    return filePathMock;
  }
});

var resetStubs = function(mockObject, property) {
  _.each(_.keys(mockObject), function(key) {
    var value = mockObject[key];

    if (!_.isUndefined(value) && _.isString(property) && _.isFunction(value[property])) {
      value = value[property];
    }
    if (!_.isUndefined(value) && _.isFunction(value.reset)) {
      value.reset();
    }
  });
};

describe('gulp-lint-filepath', function() {
  beforeEach(function() {
    resetStubs(through2StreamMock);
    resetStubs(rulesMock);

    lintFilepath({
      mockRule1: true,
      mockRule3: true
    });

    this.processFile = through2StreamMock.obj.getCall(0).args[0];
  });

  it('should exist', function() {
    expect(lintFilepath).toBeFunction();
  });

  describe('gulp-lint-filepath plugin', function() {
    describe('process file callback', function() {
      it('should exist', function() {
        expect(this.processFile).toBeFunction();
      });

      it('should call callback with file', function() {
        var callback = sinon.stub();
        this.processFile({ path: '.' }, '', callback);

        expect(callback).toHaveBeenCalledOnce();
        expect(callback.getCall(0).args[0]).toBeNull();
        expect(callback.getCall(0).args[1]).toEqual({ path: '.' });
      });

      it('should run all rules for results', function() {
        this.processFile({ path: '.' }, '', sinon.stub());

        expect(rulesMock.mockRule1).toHaveBeenCalledOnce();
        expect(rulesMock.mockRule3).toHaveBeenCalledOnce();
      });

      it('should not run rules without options', function() {
        this.processFile({ path: '.' }, '', sinon.stub());

        expect(rulesMock.mockRule2).not.toHaveBeenCalled();
      });
    });

    describe('stream complete callback', function() {
      beforeEach(function() {
        this.streamComplete = through2StreamMock.obj.getCall(0).args[1];
        resetStubs(rulesMock, 'done');
      });

      it('should exist', function() {
        expect(this.streamComplete).toBeFunction();
      });

      it('should call callback', function() {
        var callback = sinon.stub();
        this.streamComplete(callback);

        expect(callback).toHaveBeenCalledOnce();
      });

      it('should run all rules for final results', function() {
        this.streamComplete(sinon.stub());

        expect(rulesMock.mockRule1.done).toHaveBeenCalledOnce();
        expect(rulesMock.mockRule2.done).toHaveBeenCalledOnce();
        expect(rulesMock.mockRule3.done).toHaveBeenCalledOnce();
      });
    });
  });

  describe('gulp-lint-filepath reporter', function() {
    beforeEach(function() {
      resetStubs(reportersMock);
      resetStubs(reportersMock, 'output');
      this.processFile({ path: '.' }, '', sinon.stub());
    });

    it('should exist', function() {
      expect(lintFilepath.reporter).toBeFunction();
    });

    describe('default reporter', function() {
      beforeEach(function() {
        lintFilepath.reporter();
        this.callReporter = through2StreamMock.obj.getCall(1).args[1];
      });

      it('should output default report', function() {
        this.callReporter(sinon.stub());
        expect(reportersMock.default.output).toHaveBeenCalledOnce();
        expect(reportersMock.fail.output).not.toHaveBeenCalled();
      });
    });

    describe('fail reporter', function() {
      beforeEach(function() {
        lintFilepath.reporter('fail');
        this.callReporter = through2StreamMock.obj.getCall(1).args[1];
      });

      it('should output fail report', function() {
        this.callReporter(sinon.stub());
        expect(reportersMock.fail.output).toHaveBeenCalledOnce();
        expect(reportersMock.default.output).not.toHaveBeenCalled();
      });
    });

    describe('custom reporter', function() {
      beforeEach(function() {
        this.customReporter = {
          output: sinon.stub()
        };
        lintFilepath.reporter(this.customReporter);
        this.callReporter = through2StreamMock.obj.getCall(1).args[1];
      });

      it('should output custom report', function() {
        this.callReporter(sinon.stub());
        expect(this.customReporter.output).toHaveBeenCalledOnce();
        expect(reportersMock.default.output).not.toHaveBeenCalled();
        expect(reportersMock.fail.output).not.toHaveBeenCalled();
      });
    });
  });
});
