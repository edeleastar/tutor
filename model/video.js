'use strict';

const glob = require('glob');
var path = require('path');
var sh = require('shelljs');
const futils = require('./../utils/futils');

const LearningObject = require('./learningobject.js').LearningObject;

class Video extends LearningObject {
  constructor(pattern, topic) {
    super('video');
    this.parentFolder = futils.getParentFolder();
    this.icon = 'photo';
    this.videoid = futils.getVideoId();
  }

  publish(path) {
    console.log('  -->' + this.title);
  }
}

module.exports.Video = Video;
