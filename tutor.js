#!/usr/bin/env node

'use strict';

const version = require('./package.json').version;

const fs = require('fs');
var sh = require('shelljs');
const glob = require('glob');
const futils = require('./utils/futils');
const Lab = require('./model/lab').Lab;
const Topic = require('./model/topic').Topic;
const Course = require('./model/course.js').Course;
const Portfolio = require('./model/portfolio.js').Portfolio;
const nunjucks = require('nunjucks');
var program = require('commander');

const root = __dirname;
nunjucks.configure(root + '/views', { autoescape: false });
nunjucks.installJinjaCompat();

program.arguments('<file>')
    .version(version)
    .option('-p, --private', 'Generate full private site')
    .option('-n, --new', 'Create a template course')
    .parse(process.argv);

if (program.new) {
  console.log('Creating new template course...');
  if (sh.exec('git clone https://github.com/edeleastar/tutors-starter.git', { silent: false }).code !== 0) {
    console.log('fix this and try again?');
  } else {
    console.log('Next steps...');
    console.log('Cd into "tutors-starter" and run "tutors" again');
    console.log('This will generate the course web in "tutors-starter/public-site"');
  }
} else {
  console.log('tutors course web generator: ' + version);
  if (fs.existsSync('portfolio.yaml')) {
    const portfolio = new Portfolio('portfolio');
    portfolio.publish('public-site');
  } else if (fs.existsSync('course.md')) {
    const course = new Course('course');
    course.publish('public-site');
    if (program.private) {
      const privateCourse = new Course('course', true);
      privateCourse.publish('private-site');
    }
  } else if (fs.existsSync('topic.md')) {
    const topic = new Topic('topic');
    topic.publish('public-site');
  } else if (glob.sync('*.md').length > 0) {
    const lab = new Lab();
    lab.publish('../public-site/' + futils.getParentFolder());
  } else {
    console.log('Unable to detect lab, topic or course');
  }
}
