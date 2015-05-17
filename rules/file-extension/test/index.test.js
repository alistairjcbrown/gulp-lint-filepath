'use strict';

require('jasmine-expect');

var fileExtension = require('../index');
var filePathFixture = require('../../../test/fixtures/file-path');
var filePathDirFixture = require('../../../test/fixtures/file-path-directory');

describe('file-extension rule', function() {

  describe('file-extension function', function() {
    it('should exist', function() {
      expect(fileExtension).toBeFunction();
    });

    describe('File path is a directory', function() {
      it('should not return an error message', function() {
        expect(fileExtension(filePathDirFixture, [])).toBeUndefined();
      });
    });

    describe('Matchers not provided', function() {
      it('should not return an error message', function() {
        expect(fileExtension(filePathFixture)).toBeUndefined();
      });
    });

    describe('Empty list of matchers provided', function() {
      it('should return an error message', function() {
        expect(fileExtension(filePathFixture, [])).toEqual('Unknown file extension ".ext"');
      });
    });

    describe('List of matchers provided', function() {
      it('should return an error message if extension doesn\'t match', function() {
        expect(fileExtension(filePathFixture, ['.foo'])).toEqual('Unknown file extension ".ext"');
        expect(fileExtension(filePathFixture, [/\.foo.*/])).toEqual('Unknown file extension ".ext"');
      });

      it('should not return an error message if extension does matches', function() {
        expect(fileExtension(filePathFixture, ['.ext'])).toBeUndefined();
        expect(fileExtension(filePathFixture, [/\.ex.+/])).toBeUndefined();
      });
    });
  });

  describe('done function', function() {
    it('should not exist', function() {
      expect(fileExtension.done).toBeUndefined();
    });
  });

});
