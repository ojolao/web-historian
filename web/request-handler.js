var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var helpers = require('./http-helpers.js');
var server = require('./basic-server.js');

exports.handleRequest = function (req, res) {
  console.log('method', req.method);
  console.log('url', req.url);
  var statusCode;
  if (req.method === 'GET') {


  } else if (req.method === 'POST') {

  } else if (req.method === 'OPTIONS') {

  } else if (req.method === 'PUT') {

  } else if (req.method === 'DELETE') {
    
  } else {
    statusCode = 400;
  }
    




  res.end(archive.paths.list);
};
