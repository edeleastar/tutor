'use strict';

const futils = require('./../utils/futils');
const mdutils = require('./../utils/mdutils');
var path = require('path');
var sh = require('shelljs');
const glob = require('glob');
var fs = require('fs');

class LearningObject {
  constructor(pattern) {
    this.folder = path.basename(sh.pwd());
    this.img = futils.getImageFile(pattern);
    this.link = 'index.html';
    if (fs.existsSync(pattern + '.md')) {
      this.title = mdutils.getHeader(pattern + '.md');
      this.objectives = mdutils.parse(pattern + '.md');
      this.objectivesWithoutHeader = mdutils.parseWithoutHeader(pattern + '.md');
    } else {
      this.title = pattern;
    }
  }
}

module.exports.LearningObject = LearningObject;
