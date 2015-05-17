'use strict';

var sinon = require('sinon');

module.exports = {
  __isDirectoryStub: sinon.stub(),
  statSync: function() {
    return {
      isDirectory: this.__isDirectoryStub
    };
  }
};
