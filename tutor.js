#!/usr/bin/env node

'use strict';

const glob = require('glob-promise');
const labs = require('./models/labs');
const topics = require('./models/topics');
const courses = require('./models/course');
const nunjucks = require('nunjucks');

const root = __dirname;
nunjucks.configure(root + '/views', { autoescape: false });
nunjucks.installJinjaCompat();

glob('course.md').then(files => {
  if (files.length == 1) {
    console.log('Publishing course');
    const course = courses.generateCourse();
    courses.publishCourse(course);
  } else {
    glob('topic.md').then(files => {
      if (files.length == 1) {
        console.log('Publishing topic');
        const topic = topics.generateTopic();
        topics.publishTopic(topic);
      } else {
        console.log('Publishing lab');
        const lab = labs.generateLab();
        labs.publishLab(lab);
      }
    });
  }
});

