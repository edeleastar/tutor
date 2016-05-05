'use strict';

const futils = require('./../utils/futils');
const mdutils = require('./../utils/mdutils');
const labs = require('./labs');
var sh = require('shelljs');
const nunjucks = require('nunjucks');
var path = require('path');

function generateTalk(name) {

  var talk = {
    title: '',
    link: '',
    folder: '',
    icon: '',
    imgPath: '',
    objectives: {},
    objectivesWithoutHeader: {},
  };

  function populate(talk, name) {
    talk.folder = name;
    talk.icon = 'film';
    const pdfs = futils.getFiles('*.pdf');
    talk.link = name + '/' + pdfs[0];
    const talkFileName = path.parse(talk.link).name;
    talk.imgPath = name + '/' + futils.getImageFile(path.parse(talk.link).name);
    talk.objectives = mdutils.parse(talkFileName + '.md');
    talk.objectivesWithoutHeader = mdutils.parseWithoutHeader(talkFileName + '.md');
    talk.title = mdutils.getHeader(talkFileName + '.md');
    return talk;
  }

  return populate(talk, name);
}

module.exports.generateTopic = function (topicName) {

  var topic = {
    title: {},
    img: {},
    content: {},
    topicFolder: {},
    labs: [],
    talks: [],
  };

  function populate(topic, name) {
    topic.title = mdutils.getHeader('topic.md');
    topic.content = mdutils.parse('topic.md');
    topic.topicFolder = futils.getCurrentFolder();
    const bookList = futils.getFiles('book*');
    const talkList = futils.getFiles('talk*');

    bookList.forEach(book => {
      futils.changeDirectory(book);
      topic.labs.push(labs.generateLab());
      futils.changeDirectory('..');
    });
    talkList.forEach(talkName => {
      futils.changeDirectory(talkName);
      topic.talks.push(generateTalk(talkName));
      futils.changeDirectory('..');
    });
    topic.img = futils.getTopicImage(topic);

    return topic;
  }

  return populate(topic);
};

module.exports.publishTopic = function (topic) {
  console.log(topic.title);

  topic.labs.forEach(lab => {
    futils.changeDirectory(lab.folderName);
    labs.publishLab(lab);
    futils.changeDirectory('..');
  });

  topic.talks.forEach(talk => {
    console.log('  -->' + talk.title);
    futils.copyFolder2(talk.folder, '../' + 'public-site' + '/' + topic.topicFolder + '/');
  });
  futils.copyFile(topic.img, '../' + 'public-site' + '/' + topic.topicFolder);

  topic.resources = topic.talks.concat(topic.labs);

  const path = '../' + 'public-site' + '/' + topic.topicFolder + '/index.html';
  futils.writeFile(path, nunjucks.render('topic.html', topic));
};
