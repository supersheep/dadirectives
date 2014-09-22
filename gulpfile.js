var gulp = require('gulp');
var ngtemplate = require('gulp-ngtemplate');

gulp.task('ngtpl', function() {
  gulp.src('*.tpl.html')
    .pipe(ngtemplate())
    .pipe(gulp.dest('dist'));
});

gulp.task('default',['ngtpl'])