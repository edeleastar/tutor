'use strict';

const glob = require('glob-promise');
const labs = require('./labs');
const topics = require('./topics');
const nunjucks = require('nunjucks');

const root = __dirname;
nunjucks.configure(root + '/views', { autoescape: false });
nunjucks.installJinjaCompat();

glob('course.md').then(files => {
  if (files.length == 1) {
    console.log('Publishing course');
  } else {
    glob('topic.md').then(files => {
      if (files.length == 1) {
        console.log('Publishing topic');
        const topic = topics.generateTopic();
        topics.publishTopic(topic);
      } else {
        console.log('Publishing lab');
        const lab = labs.generateLab();
        labs.publishLab(lab);
      }
    });
  }
});

