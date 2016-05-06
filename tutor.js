#!/usr/bin/env node

'use strict';

const futils = require('./utils/futils');
const labs = require('./models/labs');
const topics = require('./models/topics');
const courses = require('./models/course');
const nunjucks = require('nunjucks');

const root = __dirname;
nunjucks.configure(root + '/views', { autoescape: false });
nunjucks.installJinjaCompat();

let files = futils.getFiles('course.md');
if (files.length == 1) {
  const course = courses.generateCourse();
  courses.publishCourse(course);
} else {
  files = futils.getFiles('topic.md');
  if (files.length == 1) {
    const topic = topics.generateTopic();
    topics.publishTopic(topic);
  } else {
    files = futils.getFiles('*.md');
    if (files.length > 0) {
      const lab = labs.generateLab();
      labs.publishLab(lab);
    } else {
      console.log('Unable to detect lab, topic or course')
    }
  }
}
