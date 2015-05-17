'use strict';

var check = require('../../utils/check');

describe('check', function() {

  describe('lintResult', function() {

    it('should exist', function() {
      expect(function() {
        check().is('lintResult');
      }).not.toThrow();
    });

    describe('fails check', function() {
      it('should return false for undefined', function() {
        var value;
        expect(check(value).is('lintResult')).toBe(false);
      });

      it('should return false for null', function() {
        var value = null;
        expect(check(value).is('lintResult')).toBe(false);
      });

      it('should return false for empty array', function() {
        var value = [];
        expect(check(value).is('lintResult')).toBe(false);
      });

      it('should return false for array like object', function() {
        var value = { 1:'foo', 2:'bar', length:2 };
        expect(check(value).is('lintResult')).toBe(false);
      });

      it('should return false for object with path to single error', function() {
        var value = { 'foo': 'error1', 'bar': 'error2' };
        expect(check(value).is('lintResult')).toBe(false);
      });
    });

    describe('success check', function() {
      it('should return true for empty object', function() {
        var value = {};
        expect(check(value).is('lintResult')).toBe(true);
      });

      it('should return true for object with path to empty array of errors', function() {
        var value = { 'foo': [], 'bar': [] };
        expect(check(value).is('lintResult')).toBe(true);
      });

      it('should return true for object with path to array of one error', function() {
        var value = { 'foo': ['error1'], 'bar': ['error2'] };
        expect(check(value).is('lintResult')).toBe(true);
      });

      it('should return true for object with path to array of errors', function() {
        var value = { 'foo': ['error1', 'error2'], 'bar': ['error3', 'error4', 'error5'] };
        expect(check(value).is('lintResult')).toBe(true);
      });
    });

  });

  describe('arrayOfString', function() {

    it('should exist', function() {
      expect(function() {
        check().is('arrayOfString');
      }).not.toThrow();
    });

    describe('fails check', function() {
      it('should return false for undefined', function() {
        var value;
        expect(check(value).is('arrayOfString')).toBe(false);
      });

      it('should return false for null', function() {
        var value = null;
        expect(check(value).is('arrayOfString')).toBe(false);
      });

      it('should return false for array of numbers', function() {
        var value = [1, 2, 3];
        expect(check(value).is('arrayOfString')).toBe(false);
      });

      it('should return false for array containing a mix of types', function() {
        var value = [1, '2', 'foo'];
        expect(check(value).is('arrayOfString')).toBe(false);
      });

      it('should return false for array like object', function() {
        var value = { 1:'foo', 2:'bar', length:2 };
        expect(check(value).is('arrayOfString')).toBe(false);
      });
    });

    describe('success check', function() {
      it('should return true for empty array', function() {
        var value = [];
        expect(check(value).is('arrayOfString')).toBe(true);
      });

      it('should return true for array of strings', function() {
        var value = ['foo', 'bar', 'baz'];
        expect(check(value).is('arrayOfString')).toBe(true);
      });
    });

  });

});
