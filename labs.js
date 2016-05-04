'use strict';

const futils = require('./futils');
const mdutils = require('./mdutils');
const nunjucks = require('nunjucks');

function generateChapter(fileName) {

  var chapter = {
    content: mdutils.parse(fileName),
    file: fileName,
    shortTitle: fileName.substring(fileName.indexOf('.') + 1, fileName.lastIndexOf('.')),
    title: mdutils.getHeader(fileName),
  };
  chapter.contentWithoutHeader = mdutils.parseWithoutHeader(fileName);
  return chapter;

}

module.exports.generateLab = function () {

  var lab = {
    title: '',
    icon: 'lab',
    chapters: [],
    mdFiles: futils.getFiles('*.md'),
    directories: futils.getDirectories('.'),
    folderName: futils.getCurrentFolder(),
    topic: futils.getParentFolder(),
  };

  lab.mdFiles.forEach(fileName => {
    lab.chapters.push(generateChapter(fileName));
  });
  lab.title = lab.chapters[0].shortTitle;
  lab.link = lab.folderName + '/index.html';
  lab.objectives = lab.chapters[0].content;
  lab.objectivesWithoutHeader = lab.chapters[0].contentWithoutHeader;
  lab.imgPath = lab.folderName + '/img/main.png';
  return lab;
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
