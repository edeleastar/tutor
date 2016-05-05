'use strict';

const futils = require('./../utils/futils');
const mdutils = require('./../utils/mdutils');
const labs = require('./labs');
const topics = require('./topics');
var sh = require('shelljs');
const nunjucks = require('nunjucks');
var path = require('path');

module.exports.generateCourse = function () {

  var course = {
    title: '',
    content: {},
    topics: [],
    img: {},
  };

  function populate(course) {
    course.content = mdutils.parse('course.md');
    course.title = mdutils.getHeader('course.md');
    const topicsList = futils.getFiles('topic*');
    topicsList.forEach(topicName => {
      futils.changeDirectory(topicName);
      course.topics.push(topics.generateTopic(topicName));
      futils.changeDirectory('..');
    });
    return course;
  }

  return populate(course);
};

module.exports.publishCourse = function (course) {

  var courseSummary = {
    talks: [],
    labs: [],
    course: course,
  };

  course.topics.forEach(topic => {
    futils.changeDirectory(topic.topicFolder);
    topics.publishTopic(topic);
    Array.prototype.push.apply(courseSummary.labs, topic.labs);
    Array.prototype.push.apply(courseSummary.talks, topic.talks);
    futils.changeDirectory('..');
  });

  futils.writeFile('./public-site/index.html', nunjucks.render('course.html', course));
  futils.writeFile('./public-site/labwall.html', nunjucks.render('wall.html', courseSummary));
};
