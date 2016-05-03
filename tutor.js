'use strict';

const glob = require('glob-promise');
const generateLab = require('./lab');

glob('course.md').then(files => {
  if (files.length == 1) {
    console.log('Publishing course');
  } else {
    glob('topic.md').then(files => {
      if (files.length == 1) {
        console.log('Publishing topic');
      } else {
        console.log('Publishing lab');
        const lab = generateLab();
        console.log(lab);
      }
    });
  }
});

