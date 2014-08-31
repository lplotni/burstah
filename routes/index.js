var express = require('express');
var http = require('http');
var parseString = require('xml2js').parseString;
var _ = require('lodash');
var cheerio = require('cheerio');
var Q = require('q');
var config = require('../config.js').getConfig();

var cctray = require('./cctray.js').init();
var commitDetails = require('./commitDetails.js').init();

var router = express.Router();

var cctrayFile = {
  hostname: config.hostname,
  port: config.port,
  path: '/go/cctray.xml',
  method: 'GET',
  auth: config.auth
};

var materialsHtml = {
  hostname: config.hostname,
  port: config.port,
  method: 'GET',
  auth: config.auth
};


function buildNumber(label) {
  var nr = label;
  return nr.indexOf('::') === -1 ? nr : nr.slice(0, nr.indexOf('::')).trim();
}

function extractBuildNumbers(data) {
  return _.chain(data).map(function (d) {
    return buildNumber(d.lastBuildLabel);
  }).unique().value();
}

function withoutTimestamp(data) {
  return data.indexOf('on 2') === -1 ? data : data.slice(0, data.indexOf('on 2')).trim();
}

function parseXml(xml) {
  var deferred = Q.defer();
  parseString(xml, function (err, result) {
    deferred.resolve(cctray.prepareData(result, config.limitTo));
  });
  return deferred.promise;
}

function getBuildDuration() {
  // http://qen.ci:8153/go/properties/QEN/1160/build/1/both/cruise_job_duration
}

function enrichWithCommitDetails(basicData) {
  var deferred = Q.defer();

  var deferredObjs = _.times(basicData.length, Q.defer);
  var promises = _.map(deferredObjs, function (d) {
    return d.promise
  });

  _.each(basicData, function (data, index) {
    var materials = '';
    materialsHtml.path = commitDetails.getPath(data);
    http.get(materialsHtml, function (m) {
      m.on('data', function (htmlChunk) {
        materials += htmlChunk;
      });
      m.on('end', function () {
        var $ = cheerio.load(materials);
        try{
          var modifiedBy = withoutTimestamp($('.material_tab .change .modified_by dd')[0].children[0].data);
          var comment = $('.material_tab .change .comment p')[0].children[0].data;
          deferredObjs[index].resolve({number: data.lastBuildLabel, comment: comment, committer: modifiedBy});
        }catch(error){
          deferredObjs[index].reject(error);
        }
      });
    });
  });

  Q.allSettled(promises).then(function (results) {
    var fullData = _.map(basicData, function (data) {
      _.each(results, function (result) {
        if(result.state === 'fulfilled'){
          var res = result.value;
          if (buildNumber(data.lastBuildLabel) === res.number) {
            data.comment = res.comment;
            data.committer = res.committer;
          }
        }
      });
      return data;
    });
    deferred.resolve({stages: fullData})
  });

  return deferred.promise;
}

/* GET home page. */
router.get('/', function (req, res) {
  var deferred = Q.defer();
  var promise = deferred.promise;

  var xml = '';

  function handleCctrayRequest(r) {
    if (r.statusCode < 300) {
      r.on('data', function (chunk) {
        xml += chunk;
      });
      r.on('end', function () {
        deferred.resolve(xml);
      });
    } else {
      deferred.reject(r);
    }
  }

  http.get(cctrayFile, handleCctrayRequest).on('error', deferred.reject);

  function renderWithData(data) {
    res.render('index', data);
  }

  function renderIfError(e) {
    res.render('error', {message: 'Sorry, I didn\'t manage to get the cctray xml file', error: e});
  }

  promise
    .then(parseXml)
    .then(enrichWithCommitDetails)
    .then(renderWithData)
    .catch(renderIfError);

});

module.exports = router;
