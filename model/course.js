'use strict';

var fs = require('fs');
const glob = require('glob');
var path = require('path');
var sh = require('shelljs');
const futils = require('./../utils/futils');
const LearningObject = require('./learningobject.js').LearningObject;
const Topic = require('./topic.js').Topic;
const nunjucks = require('nunjucks');

class Course extends LearningObject {
  constructor(pattern, ignoreOff) {
    super(pattern);
    this.topics = this.harvestTopics(glob.sync('topic*').sort());
    this.credits = futils.getCredits();
    this.url = futils.getCourseUrl();
    if (!ignoreOff) {
      const ignoreTopic = futils.getIgnoreList();
      if (ignoreTopic) this.topics =
          this.topics.filter(topic => ignoreTopic.indexOf(topic.folder) == -1);
    }
  }

  harvestTopics(topicsList) {
    const topics = [];
    topicsList.forEach(topicName => {
      sh.cd(topicName);
      const topic = new Topic('topic');
      if (topic) topics.push(topic);
      sh.cd('..');
    });
    return topics;
  }

  publish(path) {
    if (!fs.existsSync(path)) {
      sh.mkdir(path);
    }

    this.topics.forEach(topic => {
      sh.cd(topic.folder);
      topic.publish(path);
      sh.cd('..');
    });
    futils.writeFile(path + '/index.html', nunjucks.render('course.html', this));
    futils.copyFileToFolder(this.img, path);
    this.publishWalls(path);
  }

  publishWalls(path) {
    this.allTalks = {
      title: this.title,
      resources: [],
      icon: 'film',
      credits: futils.getCredits(),
    };
    this.allLabs = {
      title: this.title,
      resources: [],
      icon: 'lab',
      credits: futils.getCredits(),
    };
    this.topics.forEach(topic => {
      Array.prototype.push.apply(this.allLabs.resources, topic.labs);
      Array.prototype.push.apply(this.allTalks.resources, topic.talks);
    });
    futils.writeFile(path + '/labwall.html', nunjucks.render('wall.html', this.allLabs));
    futils.writeFile(path + '/talkwall.html', nunjucks.render('wall.html', this.allTalks));
  }
}

module.exports.Course = Course;
