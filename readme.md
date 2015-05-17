# gulp-lint-filepath

A linter for file paths; allows enforcement of file naming, allowed file extensions, etc.

Fully extensible, allowing custom rules and custom reporting.

---

## Install

```
$ npm install --save-dev gulp-lint-filepath
```

## Usage

### Basic Setup

The file path linting plugin is provided as a function with a reporter property.

You will need to pipe to the plugin, and provide if with a configuration object (more details below).
To see output, you will then need to pipe to the reporter.

```js
var gulp = require('gulp');
var lintFilepath = require('gulp-lint-filepath');
var lintFilePathConfig = {};

gulp.task('lint', function () {
  return gulp.src(['./**/*.*', '!./node_modules/**/*'])
             .pipe(lintFilePath(lintFilePathConfig))
             .pipe(lintFilePath.reporter());
});
```

### Rules

The linter comes with a number of built in rules.

__Note:__ All rules are disabled by default. To turn on rules, configuration options must be provided. Please see the configuration section below.

 - `directory-index` - Enforce that directories must have an index file
 - `directory-name` - Enforce that directory names must match provided rules
 - `file-extension` - Enforce that file extensions must match provided rules
 - `file-name` - Enforce that file names must match provided rules


#### Configuration

This plugin is linted by itself. Please see the [gulpfile.js](./gulpfile.js) for an example of an actively used configuration.

Use the rule name as the key and the following as the values:

 - `directory-index` - Provide an object which can contain an `ignore` property. The value of this is an array of strings/regex for directories to be ignored from the rule.
 - `directory-name` - Provide an array of strings/regex to be checked against for a valid directory name
 - `file-extension` - Provide an array of strings/regex to be checked against for a valid file extension
 - `file-name` - Provide an array of strings/regex to be checked against for a valid file name

```js
var lintFilePathConfig = {
  'file-extension': [             // Only allows JS and JSON files
    /\.js.*/,                     // Valid:   index.json
    '.md'                         // Invalid: index.html
  ],

  'file-name': [                  // Only allows file names with alpha numeric characters,
    /^[a-z0-9-.]+$/               // as well as dash and period (but no underscore, etc)
  ],                              // Does not include the file extension!
                                  // Valid:   my-file
                                  // Invalid: my_file

  'directory-name': [             // Only allows directory names with alpha numeric characters,
    /^[a-z0-9-]+$/,               // as well as dash (but no period, underscore, etc)
    'node_modules'                // 'node_modules' is an exception and is allowed
  ],                              // Valid:   my-directory
                                  // Invalid: my.directory

  'directory-index': {            // Enforce that all directories have an index file
    ignore: [ /(\.*\/)?config/ ]  // except config directories which are exempt
  },
};
```

#### Custom Rules

Rule have a simple API. The rule itself is a function, which will be provided a [`FilePath` object](./utils/file-path.js) and the contents of the corresponding key in the configuration object.

They can also have an optional `done` property which is a function. This will be called once the rule function has been called for all file paths to retrieve final linting information.

Below is an example of a rule which will cause an error if a file such as `index.test.js` were present.

```js
var gulp = require('gulp');
var lintFilepath = require('gulp-lint-filepath');
var lintFilePathConfig = {
  'find-test-files': '.test'
};

var lintFilePathCustomRules = {
  'find-test-files': function(filePath, matcher) {
    if (filePath.filename.indexOf(matcher) > -1) {
      return 'Test file found "' + filePath.filename + filePath.extension + '"';
    }
  }
};

gulp.task('lint', function () {
  return gulp.src(['./**/*.*', '!./node_modules/**/*'])
             .pipe(lintFilePath(lintFilePathConfig, lintFilePathCustomRules))
             .pipe(lintFilePath.reporter());
});
```

__Note:__ Please feel free to put up an issue / pull request for useful rules you have thought of / created.
They can be easily added to the `rules` directory, as each rule is self contained and dynamically required.


### Reporters

To see output of the linting error, you will then need to pipe to the reporter. The task can also be failed by then piping to the fail reporter, which will halt the task if any linting errors are present.

At present only the `default` and `fail` reporters are built in, with the default reporter being chosen by providing no parameter, and the fail reporter being chosen by passing `'fail'`. See below for custom reporting.

```js
gulp.task('lint', function () {
  return gulp.src(['./**/*.*', '!./node_modules/**/*'])
             .pipe(lintFilePath(lintFilePathConfig))
             .pipe(lintFilePath.reporter())
             .pipe(lintFilePath.reporter('fail'));
});
```

#### Custom Reporters

Reporters have a simple API. The reporter itself is a object with an `output` property which is a function. This will be called after the linting is complete.

Below is an example of a reporter which outputs a count of the file paths with linting errors.

```js
var gulp = require('gulp');
var lintFilepath = require('gulp-lint-filepath');
var lintFilePathConfig = {
  'find-test-files': '.test'
};

var lintFilePathCustomReporter = {
  output: function(results) {
    var errorPathCount = Object.keys(results).length;
    console.log(errorPathCount + ' file paths with errors');
  }
};

gulp.task('lint', function () {
  return gulp.src(['./**/*.*', '!./node_modules/**/*'])
             .pipe(lintFilePath(lintFilePathConfig, lintFilePathCustomRules))
             .pipe(lintFilePath.reporter(lintFilePathCustomReporter));
});
```

__Note:__ Please feel free to put up an issue / pull request for useful reporters you have thought of / created.
They can be easily added to the `reporters` directory, as each reporter is self contained and dynamically required.

## Contact

Twitter [@alistairjcbrown](http://twitter.com/alistairjcbrown)
