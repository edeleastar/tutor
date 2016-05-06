'use strict';

var fs = require('fs');
var path = require('path');
const glob = require('glob');
var sh = require('shelljs');

module.exports.getFiles = function (pattern) {
  return glob.sync(pattern);
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

module.exports.changeDirectory = function (directory) {
  sh.cd(directory);
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

module.exports.copyFile = function (src, dest) {
  sh.cp('-rf', src, dest);
};

module.exports.copyFolder = function (src, dest) {
  sh.mkdir('-p', dest);
  sh.cp('-rf', src, dest);
};

function getImageFile(name) {
  if (fs.existsSync(name + '.png'))
    return name + '.png';
  else if (fs.existsSync(name + '.jpg'))
    return name + '.jpg';
  else if (fs.existsSync(name + '.jpeg'))
    return name + '.jpeg';
  else if (fs.existsSync(name + '.gif'))
    return name + '.gif';
  else
    return null;
};

module.exports.getTopicImage = function (topic) {
  var imgFile = getImageFile('topic');
  if (imgFile)
    return imgFile;
  else {
    if (topic.talks.length > 0)
      return topic.talks[0].imgPath;
    else if (topic.labs.length > 0)
      return topic.labs[0].imgPath;
  }
};

module.exports.getImageFile = function (name) {
  return getImageFile(name);
};

module.exports.getCourseUrl = function () {
  if (fs.existsSync('courseurl')) {
    var array = fs.readFileSync('courseurl').toString().split('\n');
    return array[0];
  } else {
    return '';
  }
};

module.exports.getIgnoreList = function () {
  if (fs.existsSync('mbignore')) {
    var array = fs.readFileSync('mbignore').toString().split(' ');
    return array;
  } else {
    return null;
  }
};

module.exports.getCredits = function () {
  if (fs.existsSync('credits')) {
    var array = fs.readFileSync('credits').toString().split('\n');
    return array[0];
  } else {
    return '';
  }
};
