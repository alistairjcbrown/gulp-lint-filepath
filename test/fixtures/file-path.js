var directory = '/root/subdir/subsubdir';
var extension = '.ext';
var filename = 'file';

module.exports = {
  relative: '../subdir/subsubdir',
  directory: directory,
  extension: extension,
  filename: filename,
  isDirectory: false,
  value: directory + '/' + filename + extension
};
