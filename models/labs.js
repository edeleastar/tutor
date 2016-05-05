'use strict';

const futils = require('./../utils/futils');
const mdutils = require('./../utils/mdutils');
const nunjucks = require('nunjucks');

function generateChapter(fileName) {

  var chapter = {
    content: {},
    file: '',
    shortTitle: '',
    title: '',
  };

  function populate(chapter) {
    chapter.content = mdutils.parse(fileName);
    chapter.file = fileName;
    chapter.shortTitle = fileName.substring(fileName.indexOf('.') + 1, fileName.lastIndexOf('.'));
    chapter.title = mdutils.getHeader(fileName);
    chapter.contentWithoutHeader = mdutils.parseWithoutHeader(fileName);
    return chapter;
  }

  return populate(chapter);
}

module.exports.generateLab = function () {

  var lab = {
    title: '',
    link: '',
    imgPath: '',
    icon: 'lab',
    objectives: {},
    objectivesWithoutHeader: {},
    chapters: [],
    mdFiles: [],
    directories: [],
    folderName: '',
    topic: '',
  };

  function populate(lab) {
    lab.mdFiles = futils.getFiles('*.md');
    lab.directories = futils.getDirectories('.');
    lab.folderName = futils.getCurrentFolder();
    lab.topic = futils.getParentFolder();
    lab.mdFiles.forEach(fileName => {
      lab.chapters.push(generateChapter(fileName));
    });
    lab.title = lab.chapters[0].shortTitle;
    lab.link = lab.folderName + '/index.html';
    lab.imgPath = lab.folderName + '/img/main.png';
    lab.objectives = lab.chapters[0].content;
    lab.objectivesWithoutHeader = lab.chapters[0].contentWithoutHeader;
    return lab;
  }

  return populate(lab);
};

module.exports.publishLab = function (lab) {

  console.log('  -->' + lab.title);
  const path = '../../' + 'public-site' + '/' + lab.topic + '/' + lab.folderName;
  futils.remove(path);
  lab.directories.forEach(directory => {
    futils.copyFolder(directory, path + '/' + directory);
  });
  futils.writeFile(path + '/index.html', nunjucks.render('lab.html', lab));
};
