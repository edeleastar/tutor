#!/usr/bin/env node

'use strict';

const version = require('./package.json').version;
const program = require('commander');

const fs = require('fs');
const sh = require('shelljs');
const glob = require('glob');
const futils = require('./utils/futils');

const nunjucks = require('nunjucks');
const root = __dirname;
nunjucks.configure(root + '/views', {autoescape: false});
nunjucks.installJinjaCompat();

const Lab = require('./model/lab').Lab;
const Topic = require('./model/topic').Topic;
const Course = require('./model/course.js').Course;
const Portfolio = require('./model/portfolio.js').Portfolio;

program.arguments('<file>')
    .version(version)
    .option('-p, --private', 'Generate full private site')
    .option('-n, --new', 'Create a template course')
    .parse(process.argv);

if (program.new) {
  versionCmd();
  newCmd();
} else {
  versionCmd();
  inferCommand()
}

function versionCmd() {
  console.log('tutors course web generator: ' + version);
}

function newCmd() {
  console.log('Creating new template course...');
  if (sh.exec('git clone https://github.com/edeleastar/tutors-starter.git', {silent: false}).code !== 0) {
    console.log('fix this and try again?');
  } else {
    console.log('Next steps...');
    console.log('cd into "tutors-starter" and run "tutors" again');
    console.log('This will generate the course web in "tutors-starter/public-site"');
  }
}

function inferCommand() {
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
