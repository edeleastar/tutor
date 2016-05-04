'use strict';

var fs = require('fs');
var path = require('path');
const glob = require('glob');
var sh = require('shelljs');

module.exports.getFiles = function (pattern) {
  return glob.sync('*.md');
};

module.exports.getDirectories = function (srcpath) {
  return fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};

module.exports.readFile = function (filename) {
  return fs.readFileSync(filename, 'utf8');
};

module.exports.writeFile = function (filename, contents) {
  return fs.writeFileSync(filename, contents, 'utf8');
};

module.exports.getCurrentFolder = function () {
  return path.basename(sh.pwd());
};

module.exports.getCurrentDirectory = function () {
  return sh.pwd();
};

module.exports.getParentFolder = function () {
  return path.basename(path.dirname(sh.pwd()));
};

module.exports.remove = function (folder) {
  sh.rm('-rf', folder);
};

module.exports.copyFolder = function (src, dest) {
  sh.mkdir('-p', dest);
  sh.cp('-rf', src, path.dirname(dest));
};

