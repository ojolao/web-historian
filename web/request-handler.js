var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require('./http-helpers.js');
var server = require('./basic-server.js');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  console.log('method', req.method);
  console.log('url', req.url);
  // console.log(path);
  var statusCode;
  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile(path.join(__dirname, './public/index.html'), 'utf8', (error, data) => {
        if (error) { throw error; }
        statusCode = 200;
        res.writeHead(statusCode, httpHelpers.headers);
        res.end(data);
      });
    } else {
      archive.isUrlArchived(req.url.slice(1), function(bool) {
        if (bool) {
          fs.readFile(archive.paths.archivedSites + req.url, 'utf8', (error, data) => {
            if (error) { throw error; }
            statusCode = 200;
            res.writeHead(statusCode, httpHelpers.headers);
            res.end(data);
          });
        } else {
          statusCode = 404;
          res.writeHead(statusCode, httpHelpers.headers);
          res.end('');
        }
      });
    }
  } else if (req.method === 'POST') {
    var body = '';
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function () {
      var url = body.slice(4);
      archive.isUrlArchived(url, function(bool) {
        if (bool) {
          fs.readFile(archive.paths.archivedSites + '/' + url, 'utf8', (error, data) => {
            if (error) { throw error; }
            statusCode = 200;
            res.writeHead(statusCode, httpHelpers.headers);
            res.end(data);
          });
        } else {
          archive.isUrlInList(url, function(bool2) {
            if (!bool2) {
              archive.addUrlToList(url, function() {
                console.log('Added ' + url + ' to the list');
              });
            }
          });
          fs.readFile(path.join(__dirname, './public/loading.html'), 'utf8', (error, data) => {
            if (error) { console.log('error', error); }
            console.log('data', data);
            statusCode = 200;
            res.writeHead(statusCode, httpHelpers.headers);
            res.end(data);
          });
        }
      });
    });
  } else if (req.method === 'OPTIONS') {
    statusCode = 200;
    res.writeHead(statusCode, httpHelpers.headers);
    res.end('');
  } else {
    statusCode = 400;
    res.writeHead(statusCode, httpHelpers.headers);
    res.end('');
  }
};
