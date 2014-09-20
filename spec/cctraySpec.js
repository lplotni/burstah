describe('cctray', function () {

  var cctray;

  beforeEach(function(){
    cctray = require('../routes/cctray.js').init();
  });

  describe('extractBuildNumbers', function () {
    it('should return all build numbers', function () {
      expect(cctray.extractBuildNumbers()).toEqual('not implemented');
    });
  });

  describe('prepareData()', function() {
    var cctrayJSON = {
      "Projects": {
        "Project": [
          {
            "$": {
              "name": "QEN :: build",
              "activity": "Sleeping",
              "lastBuildStatus": "Success",
              "lastBuildLabel": "1160",
              "lastBuildTime": "2014-07-11T16:10:02",
              "webUrl": "http://someIp:8153/go/pipelines/QEN/1160/build/1"
            }
          },
          {
            "$": {
              "name": "QEN :: build :: both",
              "activity": "Sleeping",
              "lastBuildStatus": "Success",
              "lastBuildLabel": "1160",
              "lastBuildTime": "2014-07-11T16:10:02",
              "webUrl": "http://someIp:8153/go/tab/build/detail/QEN/1160/build/1/both"
            }
          },
          {
            "$": {
              "name": "QEN :: build :: another",
              "activity": "Sleeping",
              "lastBuildStatus": "Success",
              "lastBuildLabel": "1160",
              "lastBuildTime": "2014-07-11T16:10:02",
              "webUrl": "http://someIp:8153/go/tab/build/detail/QEN/1160/build/1/another"
            }
          }
        ]
      }
    };

    it('should return the project information in the correct format', function(){
        var result = cctray.prepareData(cctrayJSON, []);
        var projects = [
          {
            "name": "QEN :: build :: both",
            "activity": "Sleeping",
            "lastBuildStatus": "Success",
            "lastBuildLabel": "1160",
            "lastBuildTime": "2014-07-11T16:10:02",
            "webUrl": "http://someIp:8153/go/tab/build/detail/QEN/1160/build/1/both"
          },
          {
            "name": "QEN :: build :: another",
            "activity": "Sleeping",
            "lastBuildStatus": "Success",
            "lastBuildLabel": "1160",
            "lastBuildTime": "2014-07-11T16:10:02",
            "webUrl": "http://someIp:8153/go/tab/build/detail/QEN/1160/build/1/another"
          }
        ];
      expect(result).toEqual(projects);
    });

    it('should return only the requested project information', function () {
      var result = cctray.prepareData(cctrayJSON, ['QEN :: build :: both']);
      var requestedProject = [
        {
          "name": "QEN :: build :: both",
          "activity": "Sleeping",
          "lastBuildStatus": "Success",
          "lastBuildLabel": "1160",
          "lastBuildTime": "2014-07-11T16:10:02",
          "webUrl": "http://someIp:8153/go/tab/build/detail/QEN/1160/build/1/both"
        }
      ];

      expect(result).toEqual(requestedProject);
    });
  })
});
