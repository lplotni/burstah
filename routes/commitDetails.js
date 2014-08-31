var _ = require('lodash');

var commitDetails = {
  getPath: function(stageData) {
    var names = stageData.name.split("::");
    return '/go/pipelines/' +names[0].trim()+'/'+stageData.lastBuildLabel+'/'+names[1].trim()+'/1/materials';
  }
};

exports.init = function(){return commitDetails;};
