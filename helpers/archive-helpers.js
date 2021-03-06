var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var httpHelpers = require('../web/http-helpers.js');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (error, data) => {
    if (error) { throw error; }
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    if (urls.indexOf(url) !== -1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', 'utf8', (error) => {
    if (error) { throw error; }
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.stat(exports.paths.archivedSites + '/' + url, (error, stats) => {
    if (error) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) { 
    var options = {
      host: url,
    };

    http.get(options, function(res) {
      const statusCode = res.statusCode;

      var error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` + `Status Code: ${statusCode}`);
      }
      if (error) {
        console.log(error.message);
        res.resume();
      }
      res.setEncoding('utf8');
      var rawData = '';
      res.on('data', (chunk) => rawData += chunk);
      res.on('end', () => {
        fs.open(exports.paths.archivedSites + '/' + url, 'w', function(error, fd) { 
          if (error) { throw error; }
          fs.writeFile(exports.paths.archivedSites + '/' + url, rawData, (err) => {
            if (err) { throw err; }
          });
        });
      });

    }).on('error', function(e) {
      console.log('Got error: ' + e.message);
    });

    fs.open(exports.paths.list, 'w', function(error, fd) { 
      if (error) { throw error; }
      fs.writeFile(exports.paths.list, '', (err) => {
        if (err) { throw err; }
      });
    });

  });
};
