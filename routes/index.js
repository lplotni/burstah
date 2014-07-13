var express = require('express');
var http = require('http');
var parseString = require('xml2js').parseString;
var _ = require('lodash');
var cheerio = require('cheerio');
var Q = require('q');
var config = require('../config.js').getConfig();

var router = express.Router();

var buildNames = _.map(config.project.stages, function (stage) {
  return config.project.name + ' :: ' + stage
});

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

function prepareData(cctrayObject) {
  return _.chain(cctrayObject.Projects.Project)
    .map(function (element) {
           return element.$;
         })
    .filter(function (element) {
              return _.contains(buildNames, element.name);
            })
    .value();
}

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
    deferred.resolve(prepareData(result));
  });
  return deferred.promise;
}

function enrichWithCommitDetails(basicData) {
  var deferred = Q.defer();

  var buildNumbers = extractBuildNumbers(basicData);
  materialsHtml.path = '/go/pipelines/QEN/' + buildNumbers[0] + '/build/1/materials'

  var deferredObjs = _.times(buildNumbers.length, Q.defer);
  var promises = _.map(deferredObjs, function (d) {
    return d.promise
  });

  _.each(buildNumbers, function (nr, index) {
    var materials = '';
    materialsHtml.path = '/go/pipelines/QEN/' + nr + '/build/1/materials';
    http.get(materialsHtml, function (m) {
      m.on('data', function (htmlChunk) {
        materials += htmlChunk;
      });
      m.on('end', function () {
        $ = cheerio.load(materials);
        var modifiedBy = withoutTimestamp($('.material_tab .change .modified_by dd')[0].children[0].data);
        var comment = $('.material_tab .change .comment p')[0].children[0].data;
        deferredObjs[index].resolve({number: nr, comment: comment, committer: modifiedBy});
      });
    });
  });

  Q.all(promises).done(function (results) {
    var fullData = _.map(basicData, function (data) {
      _.each(results, function (result) {
        if (buildNumber(data.lastBuildLabel) === result.number) {
          data.comment = result.comment;
          data.committer = result.committer;
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