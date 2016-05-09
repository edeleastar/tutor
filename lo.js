#!/usr/bin/env node

'use strict';

const futils = require('./utils/futils');
const nunjucks = require('nunjucks');
const fs = require('fs');

const Course = require('./model/course.js').Course;

const root = __dirname;
nunjucks.configure(root + '/views', { autoescape: false });
nunjucks.installJinjaCompat();

if (fs.existsSync('course.md')) {
  const course = new Course('course');
  course.publish('public-site');
}
