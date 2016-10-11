/*eslint strict: ["error", "never"]*/

const gulp = require('gulp');
const env = require('./tools/gulp/env');
const livereload = require('gulp-livereload');

// Setup Javascript appletys task
const bundle = require('./tools/gulp/tasks/bundle');

// Setup Sass tasks
const sass = require('./tools/gulp/tasks/sass');

gulp
	.task('build', [bundle.build, sass.build])
	.task('clean', [bundle.clean, sass.clean])
	.task('watch', [bundle.watch, sass.watch], () => livereload.listen())
	.task('default', env.isProduction ? ['build'] : ['watch']);
