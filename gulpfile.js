var gulp = require('gulp');
var concat = require('gulp-concat');
var jsdoc = require('gulp-jsdoc3');
var closureCompiler = require('gulp-closure-compiler');

gulp.task('combine-js', [], function() {
	return gulp.src('src/old/*.js')
	.pipe(concat('openGDSMobilelib.js'))
	.pipe(gulp.dest('dist'))
});

gulp.task('doc', function (cb){

    gulp.src(['README.md', './src/js/*.js'], {read: false})
    .pipe(jsdoc(cb));
});

/*
gulp.task('closure-compiler-debug', function() {
	return gulp.src([
		'src/js/!*.js',
		'closure-library/closure/goog/!**.js'])
		.pipe(closureCompiler({
			compilerPath: 'bower_components/closure-compiler/compiler.jar',
			fileName: 'dist/openGDSMobile-debug.js',
			compilerFlags: {
				entry_point: [
					'openGDSMobile','openGDSMobile.MapVis'
				],
				/!*closure_entry_point: 'openGDSMobile',*!/
				/!*only_closure_dependencies: true,
				warning_level: 'VERBOSE'*!/
			}
		}))
		.pipe(gulp.dest('dist'));
});
*/

//gulp.task('default', ['combine-js']);
gulp.task('default', ['doc']);

