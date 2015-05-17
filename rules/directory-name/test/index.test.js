'use strict';

require('jasmine-expect');

var directoryName = require('../index');
var filePathFixture = require('../../../test/fixtures/file-path');
var filePathDirFixture = require('../../../test/fixtures/file-path-directory');

describe('directory-name rule', function() {

  describe('directory-name function', function() {
    it('should exist', function() {
      expect(directoryName).toBeFunction();
    });

    describe('File path is not a directory', function() {
      it('should not return an error message', function() {
        expect(directoryName(filePathFixture, [])).toBeUndefined();
      });
    });

    describe('Matchers not provided', function() {
      it('should not return an error message', function() {
        expect(directoryName(filePathDirFixture)).toBeUndefined();
      });
    });

    describe('Empty list of matchers provided', function() {
      it('should return an error message', function() {
        expect(directoryName(filePathDirFixture, [])).toEqual('Invalid directory name "directory"');
      });
    });

    describe('List of matchers provided', function() {
      it('should return an error message if name doesn\'t match', function() {
        expect(directoryName(filePathDirFixture, ['foo'])).toEqual('Invalid directory name "directory"');
        expect(directoryName(filePathDirFixture, [/.+foo.*/])).toEqual('Invalid directory name "directory"');
      });

      it('should not return an error message if name does matches', function() {
        expect(directoryName(filePathDirFixture, ['directory'])).toBeUndefined();
        expect(directoryName(filePathDirFixture, [/.*dir.*/])).toBeUndefined();
      });
    });
  });

  describe('done function', function() {
    it('should not exist', function() {
      expect(directoryName.done).toBeUndefined();
    });
  });

});
