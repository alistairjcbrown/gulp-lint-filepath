'use strict';

require('jasmine-expect');

var fileName = require('../index');
var filePathFixture = require('../../../test/fixtures/file-path');
var filePathDirFixture = require('../../../test/fixtures/file-path-directory');

describe('file-name rule', function() {

  describe('file-name function', function() {
    it('should exist', function() {
      expect(fileName).toBeFunction();
    });

    describe('File path is a file', function() {
      it('should not return an error message', function() {
        expect(fileName(filePathDirFixture, [])).toBeUndefined();
      });
    });

    describe('Matchers not provided', function() {
      it('should not return an error message', function() {
        expect(fileName(filePathFixture)).toBeUndefined();
      });
    });

    describe('Empty list of matchers provided', function() {
      it('should return an error message', function() {
        expect(fileName(filePathFixture, [])).toEqual('Invalid file name "file.ext"');
      });
    });

    describe('List of matchers provided', function() {
      it('should return an error message if name doesn\'t match', function() {
        expect(fileName(filePathFixture, ['foo'])).toEqual('Invalid file name "file.ext"');
        expect(fileName(filePathFixture, [/.+foo.*/])).toEqual('Invalid file name "file.ext"');
      });

      it('should not return an error message if name does matches', function() {
        expect(fileName(filePathFixture, ['file.ext'])).toBeUndefined();
        expect(fileName(filePathFixture, [/.*fil.*/])).toBeUndefined();
      });
    });
  });

  describe('done function', function() {
    it('should not exist', function() {
      expect(fileName.done).toBeUndefined();
    });
  });

});
