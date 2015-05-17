var directory = '/root/subdir/subsubdir';
var extension = '';
var filename = 'directory';

module.exports = {
  relative: '../subdir/subsubdir',
  directory: directory,
  extension: extension,
  filename: filename,
  isDirectory: true,
  value: directory + '/' + filename + extension
};
