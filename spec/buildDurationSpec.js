describe('duration', function () {

  var duration;

  beforeEach(function () {
    duration = require('../routes/buildDuration.js').buildDuration;
  });

  describe('add', function () {
    it('should add the duration and return the current total', function () {
      expect(duration.add(10)).toEqual(10);
    });
  });
});