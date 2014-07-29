var cctray = require('../routes/cctray.js').init();
describe('cctray', function () {
  describe('extractBuildNumbers', function () {
    it('should return all build numbers', function () {
      expect(cctray.extractBuildNumbers()).toEqual('test');
    });
  });
});