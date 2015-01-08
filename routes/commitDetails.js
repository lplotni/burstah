function getBuildNumber(webUrl, pipelineName) {
    var partial = webUrl.slice(webUrl.indexOf(pipelineName)+pipelineName.length+1);
    return partial.slice(0,partial.indexOf('/'));
}

var commitDetails = {
  getPath: function(stageData) {
    var names = stageData.name.split("::");
    var pipelineName = names[0].trim();
    var stageName = names[1].trim();

    return '/go/pipelines/' +pipelineName+'/'+getBuildNumber(stageData.webUrl, pipelineName)+'/'+stageName+'/1/materials';
  }
};

exports.init = function(){return commitDetails;};
