var helpers = require('../web/http-helpers.js');
var archive = require('../helpers/archive-helpers.js');
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

exports.worker = function() {
  archive.readListOfUrls(function(urls) {
    archive.downloadUrls(urls);
  });
};

exports.worker();