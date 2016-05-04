'use strict';

const futils = require('./futils');
const mdutils = require('./mdutils');

module.exports.generateTopic = function () {

  var topic = {
    content: mdutils.parse('topic.md'),
    title: mdutils.getHeader('topic.md'),
    topicFolder: futils.getCurrentFolder(),
  };
  topic.contentWithoutHeader = content.content.substring('\n') + 1;

  topic.bookList = futils.getFiles('book*');
  topic.bookList.forEach(book => {

  });

};
