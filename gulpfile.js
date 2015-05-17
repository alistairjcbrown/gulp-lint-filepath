'use strict';
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var stylish = require('jshint-stylish');
var argv = require('yargs').argv;

var lintFilePath = require('./');
var jshintConfig = require('./config/jslint');
var lintFilePathConfig = {
  'file-extension': [
    '.js',
    '.json',
    '.md',
    ''
  ],
  'file-name': [
    /^[a-z0-9-.]+$/
  ],
  'directory-name': [
    /^[a-z0-9-]+$/
  ],
  'directory-index': {
    ignore: [
      'config',
      /(\.*\/)?utils/,
      'test/fixtures'
    ]
  },
};

gulp.task('default', ['lint', 'test']);
gulp.task('lint', ['lint-js', 'lint-path']);

gulp.task('lint-js', function() {
  return gulp.src(['./**/*.js', '!./node_modules/**/*'])
             .pipe(plugins.jshint(jshintConfig))
             .pipe(plugins.jshint.reporter(stylish))
             .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('lint-path', function() {
  return gulp.src(['./**/*.*', '!./node_modules/**/*'])
             .pipe(lintFilePath(lintFilePathConfig))
             .pipe(lintFilePath.reporter())
             .pipe(lintFilePath.reporter('fail'));
});

gulp.task('test', function() {
  var path = argv.path ? argv.path : './**/*.test.js';
  return gulp.src([path, '!./node_modules/**/*'])
             .pipe(plugins.jasmine());
});
