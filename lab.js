'use strict';

const glob = require('glob');
var marked = require('marked');
var fs = require('fs');

var path = require('path');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function generateLab() {

  var lab = {
    title: '',
    chapters: [],
    folders: [],
  };

  const files = glob.sync('*.md');

  files.forEach(file => {
    const contents = fs.readFileSync(file, 'utf8');
    const markDown = marked(contents);
    var chapter = {
      content: markDown,
    };
    lab.chapters.push(chapter);
  });

  lab.folders = getDirectories('.');

  return lab;
}

module.exports = generateLab;
