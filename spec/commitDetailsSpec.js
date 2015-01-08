describe('commitDetails', function () {

  var commitDetails;

  beforeEach(function () {
    commitDetails = require('../routes/commitDetails.js').init();
  });

  describe('getPath()', function () {
    it('should return the materials URL based on the given config', function () {
      var stageDate = {
        "name": "QEN :: build",
        "activity": "Sleeping",
        "lastBuildStatus": "Success",
        "lastBuildLabel": "commitHash",
        "lastBuildTime": "2014-07-11T16:10:02",
        "webUrl": "http://54.194.156.79:8153/go/pipelines/QEN/1160/build/1"
      };

      var path = commitDetails.getPath(stageDate);
      expect(path).toEqual('/go/pipelines/QEN/1160/build/1/materials')
    });

    it('should recognize correctly the parts of the name field', function () {
      var stageDate = {
        "name": "PIPELINE_NAME :: STAGE_NAME :: JOB_NAME ",
        "activity": "Sleeping",
        "lastBuildStatus": "Success",
        "lastBuildLabel": "1160",
        "lastBuildTime": "2014-07-11T16:10:02",
        "webUrl": "http://54.194.156.79:8153/go/tab/build/detail/PIPELINE_NAME/1160/STAGE_NAME/1/JOB_NAME"
      };
      var path = commitDetails.getPath(stageDate);
      expect(path).toEqual('/go/pipelines/PIPELINE_NAME/1160/STAGE_NAME/1/materials')
    });
  });
});