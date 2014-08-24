var _ = require('lodash');

var commitDetails = {
  getPath: function(projectName, buildNumber) {
    return '/go/pipelines/'+projectName+'/'+buildNumber+'/build/1/materials';
  }
};

exports.init = function(){return commitDetails;};
