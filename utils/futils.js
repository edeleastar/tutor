'use strict';

var fs = require('fs');
var path = require('path');
const glob = require('glob');
var sh = require('shelljs');

sh.config.silent = true;

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
  const s = sh.pwd();
  return path.basename(process.cwd());
};

module.exports.changeDirectory = function (directory) {
  sh.cd(directory);
};

module.exports.getCurrentDirectory = function () {
  return sh.pwd();
};

module.exports.getParentFolder = function () {
  return path.basename(path.dirname(process.cwd()));
};

module.exports.remove = function (folder) {
  sh.rm('-rf', folder);
};

module.exports.copyFile = function (src, dest) {
  sh.cp('-rf', src, dest);
};

module.exports.copyFileToFolder = function (src, dest) {
  sh.mkdir('-p', dest);
  sh.cp('-rf', src, dest);
};

module.exports.copyFolder = function (src, dest) {
  sh.mkdir('-p', dest);
  sh.cp('-rf', src, dest);
};

module.exports.copyTalk = function (src, dest) {
  dest =  dest + src;
  sh.mkdir('-p', dest);
  sh.cp('-rf', src + '/*.pdf', dest);
  sh.cp('-rf', src + '/*.zip', dest);
  sh.cp('-rf', src + '/*.png', dest);
  sh.cp('-rf', src + '/*.jpg', dest);
  sh.cp('-rf', src + '/*.jpeg', dest);
  sh.cp('-rf', src + '/*.gif', dest);
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
      return topic.talks[0].folder + '/' + topic.talks[0].img;
    else if (topic.labs.length > 0)
      return topic.labs[0].folder + '/' + topic.labs[0].img;
  }
};

module.exports.getImageFile = function (name) {
  return getImageFile(name);
};

module.exports.getIgnoreList = function () {
  if (fs.existsSync('mbignore')) {
    var array = fs.readFileSync('mbignore').toString().split('\n');
    for (let i=0; i<array.length; i++) {
      array[i] = array[i].trim();
    }
    return array;
  } else {
    return null;
  }
};

module.exports.initEmptyPath = function (path) {
  if (fs.existsSync(path)) {
    sh.rm('-rf', path);
  }

  sh.mkdir('-p', path);
};

function readFile(creditPath) {
  var array = fs.readFileSync(creditPath).toString().split('\n');
  return array[0];
}

module.exports.getCourseUrl = function () {
  if (fs.existsSync('courseurl'))
    return readFile('courseurl');
  else if (fs.existsSync('../courseurl'))
    return readFile('../courseurl');
  else if (fs.existsSync('../../courseurl'))
    return readFile('../../courseurl');
  else if (fs.existsSync('../../../courseurl'))
    return readFile('../../../courseurl');
  else
    return '';
};

module.exports.getCredits = function () {
  if (fs.existsSync('credits'))
    return readFile('credits');
  else if (fs.existsSync('../credits'))
    return readFile('../credits');
  else if (fs.existsSync('../../credits'))
    return readFile('../../credits');
  else if (fs.existsSync('../../../credits'))
    return readFile('../../../credits');
  else
    return '';
};

module.exports.getGitterId = function () {
  if (fs.existsSync('gitter'))
    return readFile('gitter');
  else if (fs.existsSync('../gitter'))
    return readFile('../gitter');
  else if (fs.existsSync('../../gitter'))
    return readFile('../../gitter');
  else if (fs.existsSync('../../../gitter'))
    return readFile('../../../gitter');
  else
    return '';
};


module.exports.getVideoId = function () {
  if (fs.existsSync('videoid'))
    return readFile('videoid');
  else
    return '';
};
