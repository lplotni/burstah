var gulp = require('gulp');

gulp.task('express', function() {
  var debug = require('debug')('generated');
  var app = require('./app.js');

  app.set('port', process.env.PORT || 3000);

  var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
  });
});

gulp.task('default', ['express'], function() {

});
