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
        res.end(data);
      });
    }
  } else if (req.method === 'POST') {


  } else if (req.method === 'OPTIONS') {

  } else if (req.method === 'PUT') {

  } else if (req.method === 'DELETE') {
    
  } else {
    statusCode = 400;
  }
    




  // res.end(archive.paths.list);
};
