'use strict';

require('jasmine-expect');

var proxyquire = require('proxyquire');
var sinon = require('sinon');
var fsStub = require('../fixtures/fs');
var FilePath = proxyquire('../../utils/file-path', {'fs': fsStub });

describe('file-path', function() {

  it('should exist', function() {
    expect(FilePath).toBeFunction();
  });

  describe('FilePath instance', function() {

    describe('file', function() {
      beforeEach(function() {
        fsStub.__isDirectoryStub.returns(false);
        sinon.stub(process, 'cwd').returns('/root/my-path');
        this.path = '/root/subdir/subsubdir/file.ext';
        this.filePath = new FilePath(this.path);
      });

      afterEach(function() {
        process.cwd.restore();
      });

      it('should provide the file name', function() {
        expect(this.filePath.filename).toBe('file');
      });

      it('should provide the file extension with period prefix', function() {
        expect(this.filePath.extension).toBe('.ext');
      });

      it('should provide the directory path', function() {
        expect(this.filePath.directory).toBe('/root/subdir/subsubdir');
      });

      it('should provide false for directory check', function() {
        expect(this.filePath.isDirectory).toBe(false);
      });

      it('should provide a relative path', function() {
        expect(this.filePath.relative).toBe('../subdir/subsubdir');
      });

      it('should provide the full path', function() {
        expect(this.filePath.value).toBe(this.path);
      });
    });

    describe('directory', function() {
      beforeEach(function() {
        fsStub.__isDirectoryStub.returns(true);
        sinon.stub(process, 'cwd').returns('/root/my-path');
        this.path = '/root/subdir/subsubdir/my-dir';
        this.filePath = new FilePath(this.path);
      });

      afterEach(function() {
        process.cwd.restore();
      });

      it('should provide the directory name', function() {
        expect(this.filePath.filename).toBe('my-dir');
      });

      it('should provide empty string for the file extension', function() {
        expect(this.filePath.extension).toBe('');
      });

      it('should provide the directory path', function() {
        expect(this.filePath.directory).toBe('/root/subdir/subsubdir');
      });

      it('should provide true for directory check', function() {
        expect(this.filePath.isDirectory).toBe(true);
      });

      it('should provide a relative path', function() {
        expect(this.filePath.relative).toBe('../subdir/subsubdir');
      });

      it('should provide the full path with trailing slash', function() {
        expect(this.filePath.value).toBe(this.path+'/');
      });
    });
  });

});
