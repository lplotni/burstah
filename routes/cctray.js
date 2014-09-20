var _ = require('lodash');

var cctray = {
  extractBuildNumbers: function() {
    return 'not implemented';
  },
  prepareData: function(cctrayObject, buildNames) {
    function isAJob(element) {
      return element.name.split("::").length === 3;
    }


    return _.chain(cctrayObject.Projects.Project)
      .map(function (element) {
             return element.$;
           })
      .filter(function (element) {
                return _.isEmpty(buildNames) ? isAJob(element) : _.contains(buildNames, element.name);
              })
      .value();
  }

};

exports.init = function(){return cctray;};
