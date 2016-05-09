'use strict';

const glob = require('glob');
var path = require('path');
var sh = require('shelljs');
const futils = require('./../utils/futils');

const LearningObject = require('./learningobject.js').LearningObject;

class Talk extends LearningObject {
  constructor(pattern, topic) {
    let pdfs = glob.sync('*.pdf').sort();
    if (pdfs.length === 0) pdfs = ['error: missing pdf'];
    super(path.parse(pdfs[0]).name);
    this.link = pdfs[0];
    this.parentFolder = futils.getParentFolder();
    this.icon = 'film';
  }

  publish(path) {
    console.log('  -->' + this.title);
    futils.copyFolder(this.folder, '../' + path + '/');
  }
}

module.exports.Talk = Talk;
