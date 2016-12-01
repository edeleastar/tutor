'use strict';

var fs = require('fs');
const glob = require('glob');
var path = require('path');
var sh = require('shelljs');
const futils = require('./../utils/futils');
const LearningObject = require('./learningobject.js').LearningObject;
const Course = require('./course.js').Course;
const nunjucks = require('nunjucks');

const YAML = require('yamljs');

class Portfolio extends LearningObject {
  constructor(pattern) {
    super(pattern);

    this.yaml = YAML.load('./portfolio.yaml');
    for (let courseGroup of this.yaml.courseGroups) {
      courseGroup.courses = [];
      for (let module of courseGroup.modules) {
        console.log(module);
        sh.cd(module);
        const course = new Course('course');
        if (course) courseGroup.courses.push(course);
        sh.cd('..');
      }
    }
  }

  publish(path) {
    if (!fs.existsSync(path)) {
      sh.mkdir(path);
    }

    for (let courseGroup of this.yaml.courseGroups) {
      for (let course of courseGroup.courses) {
        sh.cd(course.folder);
        course.publish('../' + path + '/' + course.folder);
        sh.cd('..');
      }
    }

    futils.writeFile(path + '/index.html', nunjucks.render('portfolio.html', this.yaml));
  }
}

module.exports.Portfolio = Portfolio;
