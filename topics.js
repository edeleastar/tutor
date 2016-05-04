'use strict';

const futils = require('./futils');
const mdutils = require('./mdutils');
const labs = require('./labs');
var sh = require('shelljs');
const nunjucks = require('nunjucks');
var path = require('path');

function generateTalk(name) {
  var talk = {
    folder: name,
    icon: 'film',
  };
  var pdfs = futils.getFiles('*.pdf');
  talk.link = name + '/' + pdfs[0];
  var talkFileName = path.parse(talk.link).name;
  talk.imgPath = name + '/' + futils.getImageFile(path.parse(talk.link).name);
  talk.objectives = mdutils.parse(talkFileName + '.md');
  talk.objectivesWithoutHeader = mdutils.parseWithoutHeader(talkFileName + '.md');
  talk.title = mdutils.getHeader(talkFileName + '.md');
  return talk;
}

module.exports.generateTopic = function (topicName) {

  var topic = {
    img: {},
    content: mdutils.parse('topic.md'),
    title: mdutils.getHeader('topic.md'),
    topicFolder: futils.getCurrentFolder(),
    labs: [],
    talks: [],
  };

  const bookList = futils.getFiles('book*');
  bookList.forEach(book => {
    futils.changeDirectory(book);
    const lab = labs.generateLab();
    topic.labs.push(lab);
    futils.changeDirectory('..');
  });

  const talkList = futils.getFiles('talk*');
  talkList.forEach(talkName => {
    futils.changeDirectory(talkName);
    var talk = generateTalk(talkName);
    topic.talks.push(talk);
    futils.changeDirectory('..');
  });

  topic.img = futils.getTopicImage(topic);
  return topic;
};

module.exports.publishTopic = function (topic) {
  console.log(topic.title);
  topic.labs.forEach(lab => {
    futils.changeDirectory(lab.folderName);
    labs.publishLab(lab);
    futils.changeDirectory('..');
  });

  topic.talks.forEach(talk => {
    futils.copyFolder2(talk.folder, '../' + 'public-site' + '/' + topic.topicFolder + '/');
  });
  futils.copyFile(topic.img, '../' + 'public-site' + '/' + topic.topicFolder);

  topic.resources = topic.talks.concat(topic.labs);

  const path = '../' + 'public-site' + '/' + topic.topicFolder + '/index.html';
  futils.writeFile(path, nunjucks.render('topic.html', topic));
};
