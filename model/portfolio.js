'use strict';

var fs = require('fs');
const glob = require('glob');
var path = require('path');
var sh = require('shelljs');
const futils = require('./../utils/futils');
const LearningObject = require('./learningobject.js').LearningObject;
const Course = require('./course.js').Course;
const nunjucks = require('nunjucks');

class Portfolio extends LearningObject {
  constructor(pattern) {
    super(pattern);
    this.courses = this.harvestCourses(glob.sync('course*').sort());
    this.credits = futils.getCredits();
    this.url = futils.getCourseUrl();
  }

  harvestCourses(coursesList) {
    const courses = [];
    coursesList.forEach(courseName => {
      sh.cd(courseName);
      const course = new Course('course');
      if (course) courses.push(course);
      sh.cd('..');
    });
    return courses;
  }

  publish(path) {
    if (!fs.existsSync(path)) {
      sh.mkdir(path);
    }

    this.courses.forEach(course => {
      sh.cd(course.folder);
      course.publish('../' + path + '/' + course.folder);
      sh.cd('..');
    });
    futils.writeFile(path + '/index.html', nunjucks.render('portfolio.html', this));
  }
}

module.exports.Portfolio = Portfolio;
