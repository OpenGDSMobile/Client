var gulp = require('gulp');
var concat = require('gulp-concat');
var jsdoc = require('gulp-jsdoc3');

gulp.task('combine-js', [], function() {
	return gulp.src('src/js/*.js')
	.pipe(concat('openGDSMobilelib.js'))
	.pipe(gulp.dest('dist'))
});

gulp.task('doc', function (cb){
    gulp.src(['README.md', './src/js/*.js'], {read: false})
    .pipe(jsdoc(cb));
});

gulp.task('default', ['combine-js']);

