'use strict';

const glob = require('glob');
var path = require('path');
var sh = require('shelljs');
const futils = require('./../utils/futils');

const LearningObject = require('./learningobject.js').LearningObject;

class Talk extends LearningObject {
  constructor(pattern, topic) {
    let resourceList = glob.sync('*.pdf').sort();
    if (resourceList.length === 0) {
      resourceList = glob.sync('*.zip').sort();
      if (resourceList.length === 0) {
        resourceList = ['error: missing pdf'];
      }
    }
    const resource = resourceList[0];

    super(path.parse(resource).name);
    this.link = resource;
    this.parentFolder = futils.getParentFolder();
    this.icon = 'film';
  }

  publish(path) {
    console.log('  -->' + this.title);

    //futils.copyFolder(this.folder, '../' + path + '/');
    futils.copyTalk(this.folder, '../' + path + '/');
  }
}

module.exports.Talk = Talk;
