const gulp = require('gulp');
const env = require('gulp/env');
const webserver = require('gulp-webserver');

gulp.task('serve', ['watch'], () => gulp.src(env.outputDirectory)
	.pipe(webserver())
);
