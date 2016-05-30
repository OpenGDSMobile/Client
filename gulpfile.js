var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('combine-js', [], function() {
	return gulp.src('src/js/*.js')
	.pipe(concat('openGDSMobilelib.js'))
	.pipe(gulp.dest('dist'))
});

gulp.task('default', ['combine-js']);

