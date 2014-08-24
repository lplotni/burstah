describe('commitDetails', function () {

  var commitDetails;

  beforeEach(function () {
    commitDetails = require('../routes/commitDetails.js').init();
  });

  describe('getPath()', function () {
    it('should return the materials URL based on the given config', function () {
      var path = commitDetails.getPath('projectName', 'buildNumber');
      expect(path).toEqual('/go/pipelines/projectName/buildNumber/build/1/materials')
    });
  });
});