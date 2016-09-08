#!/usr/bin/env node

'use strict';

const fs = require('fs');
const glob = require('glob');
const futils = require('./utils/futils');
const Lab = require('./model/lab').Lab;
const Topic = require('./model/topic').Topic;
const Course = require('./model/course.js').Course;
const Programme = require('./model/programme.js').Programme;
const nunjucks = require('nunjucks');

const root = __dirname;
nunjucks.configure(root + '/views', { autoescape: false });
nunjucks.installJinjaCompat();

if (fs.existsSync('programme.md')) {
  const programme = new Programme('programme');
  programme.publish('public-site');
} else if (fs.existsSync('course.md')) {
  const course = new Course('course');
  course.publish('public-site');
} else if (fs.existsSync('topic.md')) {
  const topic = new Topic('topic');
  topic.publish('public-site');
} else if (glob.sync('*.md').length > 0) {
  const lab = new Lab();
  lab.publish('../public-site/' + futils.getParentFolder());
} else {
  console.log('Unable to detect lab, topic or course');
}
