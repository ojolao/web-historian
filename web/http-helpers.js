var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var http = require('http');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
};



// As you progress, keep thinking about what helper functions you can put here!

exports.getRequest = function(options) {
  http.get(options, function(res) {
    const statusCode = res.statusCode;

    var error;
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\n` + `Status Code: ${statusCode}`);
    }
    if (error) {
      console.log(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }
    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      return rawData;
    });

  }).on('error', function(e) {
    console.log('Got error: ' + e.message);
  });
};