'use strict';

const futils = require('./futils');
const mdutils = require('./mdutils');
const labs = require('./labs');
const topics = require('./topics');
var sh = require('shelljs');
const nunjucks = require('nunjucks');
var path = require('path');

module.exports.generateCourse = function () {
  var course = {
    topics: [],
    img: {},
  };
  course.content = mdutils.parse('course.md');
  course.title = mdutils.getHeader('course.md');
  //course.img = futils.getCourseImage();
  var topicsList = futils.getFiles('topic*');
  topicsList.forEach(topicName => {
    futils.changeDirectory(topicName);
    const topic = topics.generateTopic(topicName);
    course.topics.push(topic);
    futils.changeDirectory('..');
  });
  return course;
};

module.exports.publishCourse = function (course) {

  course.topics.forEach(topic => {
    futils.changeDirectory(topic.topicFolder);
    topics.publishTopic(topic);
    futils.changeDirectory('..');
  });
  const path = './public-site/index.html';
  futils.writeFile(path, nunjucks.render('course.html', course));
};
