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
nunjucks.configure(root + '/views', { autoescape: false });
nunjucks.installJinjaCompat();

const Lab = require('./model/lab').Lab;
const Topic = require('./model/topic').Topic;
const Course = require('./model/course.js').Course;
const Portfolio = require('./model/portfolio.js').Portfolio;

program.arguments('<file>')
    .version(version)
    .option('-p, --private', 'Generate full private site')
    .option('-n, --new', 'Create a template course')
    .option('-s, --standalone', 'Generate standalons site')
    .parse(process.argv);

if (program.new) {
  versionCmd();
  newCmd();
} else {
  versionCmd();
  inferCommand();
}

function versionCmd() {
  console.log('tutors course web generator: ' + version);
}

function newCmd() {
  console.log('Creating new template course...');
  const courseFolderNames = generateCourseFolderNames();
  const folder = courseFolderNames[courseFolderNames.length - 1];
  updateYaml(courseFolderNames);
  if (sh.exec(`git clone https://github.com/edeleastar/tutors-starter.git ${folder}`, { silent: false }).code !== 0) {
    console.log('fix this and try again?');
  }

  console.log('Next steps...');
  console.log(`cd into ${folder} and run "tutors" again`);
  console.log('This will generate the course web in "tutors-starter/public-site"');
}

function inferCommand() {
  if (fs.existsSync('portfolio.yaml')) {
    const portfolio = new Portfolio('portfolio');
    portfolio.publish('public-site');
  } else if (fs.existsSync('course.md')) {
    const course = new Course('course');
    course.publish('public-site', false);
    if (program.private) {
      const privateCourse = new Course('course', true);
      privateCourse.publish('private-site', false);
    }
    if (program.standalone) {
      futils.copyFolder(`${root}/views/assets`, './standalone-site');
      const standaloneCourse = new Course('course', true);
      standaloneCourse.publish('standalone-site', false, true);
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

function generateCourseFolderNames() {

  const remoteRepoPartial = 'tutors-starter-';
  let i = 0;
  const allCourseNames = [];
  let freeNameFound = false;
  while (!freeNameFound) {
    const courseName = `${remoteRepoPartial}${i}`;
    if (fs.existsSync(courseName)) {
      i++;
    } else {
      freeNameFound = true;
    }

    allCourseNames.push(courseName);
  }

  return allCourseNames;
}

function updateYaml(folderNames) {
  let yaml = `
title: 'A collection of recent Modules in Modern Computer Science'
credits: 'Department of Computing & Mathematics, WIT'
courseGroups:
  - title: 'Module Group Label'
    modules:
`;
  for (const folder of folderNames) {
    yaml += `      - ${folder}
`;
  }

  fs.writeFileSync('portfolio.yaml', yaml);
}
