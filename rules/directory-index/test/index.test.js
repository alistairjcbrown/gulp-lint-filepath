'use strict';

require('jasmine-expect');

var _ = require('lodash');
var directoryIndex = require('../index');
var filePathFixture = require('../../../test/fixtures/file-path');

describe('directory-index rule', function() {

  beforeEach(function() {
    this.directory = '/root/subdir/subsubdir';
    this.filePath = _.cloneDeep(filePathFixture);
  });

  afterEach(function() {
    for (var path in directoryIndex.__directoryMap) {
      delete directoryIndex.__directoryMap[path];
    }
  });

  describe('directory-index function', function() {
    it('should exist', function() {
      expect(directoryIndex).toBeFunction();
    });

    it('should default the index flag to false', function() {
      directoryIndex(this.filePath);
      expect(directoryIndex.__directoryMap[this.directory]).toBe(false);
    });

    describe('when index found', function() {
      it('should set the index flag', function() {
        this.filePath.filename = 'index';
        directoryIndex(this.filePath);
        expect(directoryIndex.__directoryMap[this.directory]).toBe(true);
      });
    });

    describe('when ignore path provided', function() {
      it('should not default the index found flag when ignoring current directory', function() {
        var opts = { ignore: [ '../subdir/subsubdir' ] };
        directoryIndex(this.filePath, opts);
        expect(directoryIndex.__directoryMap[this.directory]).toBeUndefined();
      });

      it('should default the index found flag when ignoring parent directory', function() {
        var opts = { ignore: [ '../subdir' ] };
        directoryIndex(this.filePath, opts);
        expect(directoryIndex.__directoryMap[this.directory]).toBe(false);
      });
    });

    describe('when path is directory', function() {
      it('should not set the index found flag', function() {
        this.filePath.isDirectory = true;
        directoryIndex(this.filePath);
        expect(directoryIndex.__directoryMap[this.directory]).toBeUndefined();
      });
    });

  });

  describe('done function', function() {
    beforeEach(function() {
      directoryIndex.__directoryMap['/root/subdir-1'] = false;
      directoryIndex.__directoryMap['/root/subdir-2'] = true;
      directoryIndex.__directoryMap['/root/subdir-3'] = undefined;
      directoryIndex.__directoryMap['/root/subdir-4'] = false;
    });

    it('should exist', function() {
      expect(directoryIndex.done).toBeFunction();
    });

    it('should return mapping of directories with error messages', function() {
      var errorMessages = directoryIndex.done();
      expect(errorMessages).toEqual({
        '/root/subdir-1/': [ 'Missing index file' ],
        '/root/subdir-4/': [ 'Missing index file' ]
      });
    });
  });

});
