'use strict';

const glob = require('glob');
var path = require('path');
var sh = require('shelljs');
const nunjucks = require('nunjucks');
const futils = require('./../utils/futils');

const LearningObject = require('./learningobject.js').LearningObject;
const Talk = require('./talk.js').Talk;
const Lab = require('./lab.js').Lab;
const Video = require('./video.js').Video;

class Topic extends LearningObject {
  constructor(pattern) {
    super(pattern);
    this.talks = this.harvestTalks(glob.sync('talk*').sort());
    this.labs = this.harvestLabs(glob.sync('book*').sort());
    this.videos = this.harvestVideos(glob.sync('video*').sort());
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

  harvestVideos(videoList) {
    const videos = [];
    videoList.forEach(videoName => {
      sh.cd(videoName);
      const video = new Video(videoName);
      if (video) videos.push(video);
      sh.cd('..');
    });
    return videos;
  }

  publish(path, course) {
    const basePath = '../' + path + '/' + this.folder;
    this.standalone = course.standalone;
    futils.initEmptyPath(basePath);

    //const talks = this.videos.concat(this.talks);
    this.resources = this.talks.concat(this.labs);
    futils.copyFileToFolder(this.img, basePath);
    futils.writeFile(basePath + '/index.html', nunjucks.render('topic.html', this));

    futils.writeFile(basePath + '/ajaxlabel.html',
        nunjucks.render('ajaxlabel.html',
            { url: this.url.substring(5) + '/' + this.folder }));
    futils.writeFile(basePath + '/indexmoodle.html', nunjucks.render('indexmoodle.html', this));

    console.log(this.title);
    this.publishTalks(basePath);
    this.publishLabs(basePath, course);
  }

  publishTalks(path) {
    if (this.talks.length > 0) console.log(' Talks:');
    this.talks.forEach(talk => {
      console.log('  -->' + talk.title);

      //futils.copyFolder(talk.folder, path + '/');
      futils.copyTalk(talk.folder, path + '/');
    });
  }

  publishLabs(path, course) {
    if (this.labs.length > 0) console.log(' Labs:');
    this.labs.forEach(lab => {
      sh.cd(lab.folder);
      lab.topic = this;
      lab.publish(path, course);
      sh.cd('..');
    });
  }
}

module.exports.Topic = Topic;
