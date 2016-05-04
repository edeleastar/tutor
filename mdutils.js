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

module.exports.getHeader = function (fileName) {
  var array = fs.readFileSync(fileName).toString().split('\n');
  return array[0].substring(1);
};
