'use strict';

const marked = require('./marked');
const futils = require('./futils');
var fs = require('fs');

module.exports.parse = function (fileName) {
  const mdContent = futils.readFile(fileName);
  return marked(mdContent);
};

module.exports.parseWithoutHeader = function (fileName) {
  var content = fs.readFileSync(fileName).toString();
  const line1 = content.indexOf('\n');
  content = content.substring(line1 + 1, content.length);
  content = content.trim();
  const line2 = content.indexOf('\n');
  if (line2 > -1) {
    content = content.substring(0, line2);
  }

  return marked(content);
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
