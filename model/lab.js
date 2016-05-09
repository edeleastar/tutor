'use strict';

const glob = require('glob');
const path = require('path');
const sh = require('shelljs');
const nunjucks = require('nunjucks');
const mdutils = require('../utils/mdutils.js');
const futils = require('./../utils/futils');

const LearningObject = require('./learningobject.js').LearningObject;

class Chapter {
  constructor(fileName) {
    this.file = fileName;
    this.title = mdutils.getHeader(fileName);
    this.shortTitle = fileName.substring(fileName.indexOf('.') + 1, fileName.lastIndexOf('.'));
    this.content = mdutils.parse(fileName);
    this.contentWithoutHeader = mdutils.parseWithoutHeader(fileName);
  }
}

class Lab extends LearningObject {
  constructor(pattern) {
    const mdFiles = glob.sync('*.md').sort();
    super(path.parse(mdFiles[0]).name);
    this.parentTopic = futils.getParentFolder();
    this.chapters = this.harvestChapters(mdFiles);
    this.directories = futils.getDirectories('.');
    this.img = futils.getImageFile('img/main');
    this.icon = 'lab';
    this.credits = futils.getCredits();
  }

  harvestChapters(mdFiles) {
    const chapters = [];
    mdFiles.forEach(chapterName => {
      const chapter = {
        file: chapterName,
        title: mdutils.getHeader(chapterName),
        shortTitle: chapterName.substring(chapterName.indexOf('.') + 1,
            chapterName.lastIndexOf('.')),
        content: mdutils.parse(chapterName),
        contentWithoutHeader: mdutils.parseWithoutHeader(chapterName),
      };
      chapters.push(chapter);
    });
    return chapters;
  }

  publish (basepath) {
    console.log('  -->' + this.folder);
    const path = '../' + basepath + '/' + this.folder;
    futils.initEmptyPath(path);
    this.directories.forEach(directory => {
      futils.copyFolder(directory, path + '/');
    });
    futils.writeFile(path + '/index.html', nunjucks.render('lab.html', this));
  }
}

module.exports.Lab = Lab;
