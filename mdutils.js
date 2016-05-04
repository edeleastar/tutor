'use strict';

const marked = require('marked');
const futils = require('./futils');
var fs = require('fs');
var firstline = require('firstline');

module.exports.parse = function (fileName) {
  const mdContent = futils.readFile(fileName);
  const filtered1 = mdContent.replace(/#/g, '# ');
  const filtered2 = filtered1.replace(/# #/g, '## ');
  return marked(filtered2);
};

module.exports.parseWithoutHeader = function (fileName) {
  var array = fs.readFileSync(fileName).toString().split('\n');
  array.shift();
  var res = array.join();
  return marked(res);
};

module.exports.getHeader = function (fileName) {
  var header = '';
  var array = fs.readFileSync(fileName).toString().split('\n');
  if (array[0][0] === '#') {
    header = array[0].substring(1);
  } else {
    header = array[0];
  }

  return header;
};
