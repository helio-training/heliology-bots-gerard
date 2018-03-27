var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../heliology-bots-gerard.zip');
var kuduApi = 'https://heliology-bots-gerard.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$heliology-bots-gerard';
var password = 'qpnHPJAB05wn2BX6p4eyCa1xPAsWT4Mui9u41zHrQt8MN807hGa4MKPPnqZg';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('heliology-bots-gerard publish');
  } else {
    console.error('failed to publish heliology-bots-gerard', err);
  }
});