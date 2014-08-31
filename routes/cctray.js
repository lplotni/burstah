var _ = require('lodash');

var cctray = {
  extractBuildNumbers: function() {
    return 'test';
  },
  prepareData: function(cctrayObject, buildNames) {
    return _.chain(cctrayObject.Projects.Project)
      .map(function (element) {
             return element.$;
           })
      .filter(function (element) {
                return _.isEmpty(buildNames) ? true : _.contains(buildNames, element.name);
              })
      .value();
  }

};

exports.init = function(){return cctray;};
