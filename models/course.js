'use strict';

const futils = require('./../utils/futils');
const mdutils = require('./../utils/mdutils');
const labs = require('./labs');
const topics = require('./topics');
const nunjucks = require('nunjucks');

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
    const topicsList = futils.getFiles('topic*').sort();
    topicsList.forEach(topicName => {
      futils.changeDirectory(topicName);
      const topic = topics.generateTopic(topicName);
      if (topic) {
        course.topics.push(topic);
      }

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
    url: '',
    credits: '',
  };

  courseSummary.credits = futils.getCredits();
  courseSummary.url = futils.getCourseUrl();
  const ignoreTopic = futils.getIgnoreList();
  course.topics = course.topics.filter(topic => ignoreTopic.indexOf(topic.topicFolder) == -1);
  course.credits = courseSummary.credits;

  course.topics.forEach(topic => {
    futils.changeDirectory(topic.topicFolder);
    topic.credits = courseSummary.credits;
    topics.publishTopic(topic);
    Array.prototype.push.apply(courseSummary.labs, topic.labs);
    Array.prototype.push.apply(courseSummary.talks, topic.talks);
    futils.changeDirectory('..');
  });

  futils.writeFile('./public-site/index.html', nunjucks.render('course.html', course));
  futils.writeFile('./public-site/labwall.html', nunjucks.render('labwall.html', courseSummary));
  futils.writeFile('./public-site/talkwall.html', nunjucks.render('talkwall.html', courseSummary));

  course.topics.forEach(topic => {
    const topicPath = './public-site' + '/' + topic.topicFolder;
    futils.writeFile(topicPath + '/ajaxlabel.html',
        nunjucks.render('ajaxlabel.html', { url: courseSummary.url.substring(5) + '/' + topic.topicFolder }));
    topic.url = courseSummary.url;
    futils.writeFile(topicPath + '/indexmoodle.html', nunjucks.render('indexmoodle.html', topic));
  });
};
