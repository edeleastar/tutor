'use strict';

const futils = require('./../utils/futils');
const mdutils = require('./../utils/mdutils');
const nunjucks = require('nunjucks');

function generateChapter(name) {

  var chapter = {
    content: {},
    file: '',
    shortTitle: '',
    title: '',
  };

  function populate(chapter, fileName) {
    chapter.content = mdutils.parse(fileName);
    chapter.file = fileName;
    chapter.shortTitle = fileName.substring(fileName.indexOf('.') + 1, fileName.lastIndexOf('.'));
    chapter.title = mdutils.getHeader(fileName);
    chapter.contentWithoutHeader = mdutils.parseWithoutHeader(fileName);
    return chapter;
  }

  return populate(chapter, name);
}

module.exports.generateLab = function () {

  var lab = {
    title: '',
    link: '',
    imgPath: '',
    fullImgPath: '',
    icon: 'lab',
    objectives: {},
    objectivesWithoutHeader: {},
    chapters: [],
    mdFiles: [],
    directories: [],
    folderName: '',
  };

  function populate(lab) {
    lab.mdFiles = futils.getFiles('*.md').sort();
    if (lab.mdFiles.length == 0) {
      console.log('Unable to publish lab: ' + futils.getCurrentDirectory() + ' :Cannot find *.md');
      return null;
    }

    lab.directories = futils.getDirectories('.');
    lab.folderName = futils.getCurrentFolder();
    lab.topic = futils.getParentFolder();
    lab.mdFiles.forEach(fileName => {
      lab.chapters.push(generateChapter(fileName));
    });
    lab.title = lab.chapters[0].shortTitle;
    lab.link = lab.folderName + '/index.html';
    lab.imgPath = lab.folderName + '/img/main.png';
    lab.fullImgPath = lab.topic + '/' + lab.imgPath;
    lab.objectives = lab.chapters[0].content;
    lab.objectivesWithoutHeader = lab.chapters[0].contentWithoutHeader;
    return lab;
  }

  return populate(lab);
};

module.exports.publishLab = function (lab) {
  const path = '../../' + 'public-site' + '/' + lab.topic + '/' + lab.folderName;
  futils.remove(path);
  lab.directories.forEach(directory => {
    futils.copyFolder(directory, path + '/');
  });
  futils.writeFile(path + '/index.html', nunjucks.render('lab.html', lab));
};
