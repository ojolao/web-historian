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
    // var options = {
    //   host: req.url,
    // };
    // statusCode = 200;
    // var responseData = httpHelpers.getRequest(options);
    // // return responseData;
    // res.writeHead(statusCode, httpHelpers.headers);
    // res.end(responseData);
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
          // console.log('path', path.join(__dirname, '../test/testdata/sites', req.url));
          // CHANGE FILE PATH
          fs.readFile(archive.paths.archivedSites + req.url, 'utf8', (error, data) => {
            if (error) { throw error; }
            statusCode = 200;
            res.writeHead(statusCode, httpHelpers.headers);
            res.end(data);
          });
          // console.log('found');
        } else {
          statusCode = 404;
          res.writeHead(statusCode, httpHelpers.headers);
          res.end('');
          // console.log('not found');
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
      // check if we have the file
      archive.isUrlArchived(url, function(bool) {
        // if we have file
        if (bool) {
          // send back the file
          // CHANGE FILE PATH
          fs.readFile(archive.paths.archivedSites + '/' + url, 'utf8', (error, data) => {
            if (error) { throw error; }
            statusCode = 200;
            res.writeHead(statusCode, httpHelpers.headers);
            res.end(data);
          });
        // else if we don't have file
        } else {
          // check if it's on the list
          archive.isUrlInList(url, function(bool2) {
            // if it's not on the list
            if (!bool2) {
              // add it to the list
              archive.addUrlToList(url, function() {
                console.log('Added ' + url + ' to the list');
              });
            }
          });
          // send back loading
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
    




  // res.end(archive.paths.list);
};
