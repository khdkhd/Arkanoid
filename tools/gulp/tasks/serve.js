const gulp = require('gulp');
const webserver = require('gulp-webserver');

const env = require('tools/gulp/env');

gulp.task('serve', ['watch'], () => gulp.src(env.outputDirectory)
	.pipe(webserver())
);
