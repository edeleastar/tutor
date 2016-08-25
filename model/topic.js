'use strict';

const glob = require('glob');
var path = require('path');
var sh = require('shelljs');
const nunjucks = require('nunjucks');
const futils = require('./../utils/futils');

const LearningObject = require('./learningobject.js').LearningObject;
const Talk = require('./talk.js').Talk;
const Lab = require('./lab.js').Lab;

class Topic extends LearningObject {
  constructor(pattern) {
    super(pattern);
    this.talks = this.harvestTalks(glob.sync('talk*').sort());
    this.labs = this.harvestLabs(glob.sync('book*').sort());
    this.credits = futils.getCredits();
    this.url = futils.getCourseUrl();
    this.folder = futils.getCurrentFolder();
    this.img = futils.getTopicImage(this);
  }

  harvestTalks(talkList) {
    const talks = [];
    talkList.forEach(talkName => {
      sh.cd(talkName);
      const talk = new Talk(talkName);
      if (talk) talks.push(talk);
      sh.cd('..');
    });
    return talks;
  }

  harvestLabs(labsList) {
    const labs = [];
    labsList.forEach(labName => {
      sh.cd(labName);
      const lab = new Lab(labName);
      if (lab) labs.push(lab);
      sh.cd('..');
    });
    return labs;
  }

  publish(path) {
    const basePath = '../' + path + '/' + this.folder;
    futils.initEmptyPath(basePath);

    this.resources = this.talks.concat(this.labs);
    futils.copyFileToFolder(this.img, basePath);
    futils.writeFile(basePath + '/index.html', nunjucks.render('topic.html', this));

    futils.writeFile(basePath + '/ajaxlabel.html',
        nunjucks.render('ajaxlabel.html',
            { url: this.url.substring(5) + '/' + this.folder }));
    futils.writeFile(basePath + '/indexmoodle.html', nunjucks.render('indexmoodle.html', this));

    console.log(this.title);
    this.publishTalks(basePath);
    this.publishLabs(basePath);
  }

  publishTalks(path) {
    if (this.talks.length > 0) console.log(' Talks:');
    this.talks.forEach(talk => {
      console.log('  -->' + talk.title);

      //futils.copyFolder(talk.folder, path + '/');
      futils.copyTalk(talk.folder, path + '/');
    });
  }

  publishLabs(path) {
    if (this.labs.length > 0) console.log(' Labs:');
    this.labs.forEach(lab => {
      sh.cd(lab.folder);
      lab.topic = this;
      lab.publish(path);
      sh.cd('..');
    });
  }
}

module.exports.Topic = Topic;
