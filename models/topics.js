'use strict';

const futils = require('./../utils/futils');
const mdutils = require('./../utils/mdutils');
const labs = require('./labs');
const nunjucks = require('nunjucks');
var path = require('path');
var fs = require('fs');

function generateTalk(name) {

  var talk = {
    title: '',
    link: '',
    topic: '',
    folder: '',
    icon: '',
    imgPath: '',
    fullImgPath: '',
    objectives: {},
    objectivesWithoutHeader: {},
  };

  function populate(talk, name) {
    talk.folder = name;
    talk.icon = 'film';
    const pdfs = futils.getFiles('*.pdf');
    if (pdfs.length == 0) {
      console.log('Unable to publish talk: '  + futils.getCurrentDirectory() + '/' + name);
      return null;
    }

    talk.link = name + '/' + pdfs[0];
    const talkFileName = path.parse(talk.link).name;
    talk.imgPath = name + '/' + futils.getImageFile(path.parse(talk.link).name);
    if (!fs.existsSync(talkFileName + '.md')) {
      console.log('Unable to publish talk: ' + futils.getCurrentDirectory() + '/' + name);
      return null;
    }

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
    objectives: {},
    objectivesWithoutHeader: {},
    topicFolder: {},
    labs: [],
    talks: [],
  };

  function populate(topic, name) {
    if (!fs.existsSync('topic.md')) {
      console.log('Unable to publish topic: ' + futils.getCurrentDirectory() + '/' + name + '. Cannot find topic.md');
      return null;
    }

    topic.title = mdutils.getHeader('topic.md');
    topic.objectives = mdutils.parse('topic.md');
    topic.objectivesWithoutHeader = mdutils.parseWithoutHeader('topic.md');
    topic.topicFolder = futils.getCurrentFolder();
    const bookList = futils.getFiles('book*');
    const talkList = futils.getFiles('talk*');

    bookList.forEach(book => {
      futils.changeDirectory(book);
      const lab = labs.generateLab();
      if (lab) {
        topic.labs.push(lab);
      }

      futils.changeDirectory('..');
    });
    talkList.forEach(talkName => {
      futils.changeDirectory(talkName);
      const talk = generateTalk(talkName);
      if (talk) {
        talk.fullImgPath = topic.topicFolder + '/' + talk.imgPath;
        talk.topic = topic.topicFolder;
        topic.talks.push(talk);
      }

      futils.changeDirectory('..');
    });
    topic.img = futils.getTopicImage(topic);

    return topic;
  }

  return populate(topic, topicName);
};

module.exports.publishTopic = function (topic) {
  console.log(topic.title);

  topic.labs.forEach(lab => {
    futils.changeDirectory(lab.folderName);
    lab.credits = topic.credits;
    labs.publishLab(lab);
    futils.changeDirectory('..');
  });

  topic.talks.forEach(talk => {
    console.log('  -->' + talk.title);
    futils.copyFolder(talk.folder, '../' + 'public-site' + '/' + topic.topicFolder + '/');
  });
  futils.copyFile(topic.img, '../' + 'public-site' + '/' + topic.topicFolder);

  topic.resources = topic.talks.concat(topic.labs);

  const basePath = '../' + 'public-site' + '/' + topic.topicFolder;
  futils.writeFile(basePath + '/index.html', nunjucks.render('topic.html', topic));
};
