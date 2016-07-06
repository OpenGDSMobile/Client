var gulp = require('gulp');
var concat = require('gulp-concat');
var jsdoc = require('gulp-jsdoc3');
var closureCompiler = require('gulp-closure-compiler');

gulp.task('combine-js', [], function() {
	return gulp.src('src/js/*.js')
	.pipe(concat('openGDSMobilelib.js'))
	.pipe(gulp.dest('dist'))
});

gulp.task('doc', function (cb){
    gulp.src(['README.md', './src/js/*.js'], {read: false})
    .pipe(jsdoc(cb));
});

gulp.task('closure-compiler', function() {
	return gulp.src([
		/*'dist/openGDSMobilelib.js',*/
		'src/js/*.js',
		'clsoure-library/closure/goog/**.js'])
		.pipe(closureCompiler({
			compilerPath: 'closure-compiler/compiler.jar',
			fileName: 'ttt.js',
			compilerFlags: {
				closure_entry_point: 'openGDSMobile.MapVis',
				only_closure_dependencies: true,
				warning_level: 'VERBOSE'
			}
		}))
		.pipe(gulp.dest('dist'));
});

//gulp.task('default', ['combine-js']);
gulp.task('default', ['closure-compiler']);

