var gulp = require('gulp');
var shell = require('gulp-shell');
var jasmine = require('gulp-jasmine');
var compass = require('gulp-compass');

gulp.task('express', function() {
  var debug = require('debug')('generated');
  var app = require('./app.js');

  app.set('port', process.env.PORT || 3000);

  var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
  });
});

gulp.task('fakeGo',shell.task(['ruby fakeGo/server.rb']));

gulp.task('test', function(){
  return gulp.src('spec/*.js').pipe(jasmine());
});

gulp.task('compass', function() {
  gulp.src('./sass/*.scss')
    .pipe(compass(
      {
       css: 'public/stylesheets/',
       sass: 'sass/'
      }));
});
gulp.task('default', ['fakeGo','express'], function() {

});
