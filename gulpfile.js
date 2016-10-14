/*eslint strict: ["error", "never"]*/

const gulp = require('gulp');
const env = require('gulp/env');
const livereload = require('gulp-livereload');

// Setup Javascript appletys task
const bundle = require('gulp/tasks/bundle');

// Setup Sass tasks
const sass = require('gulp/tasks/sass');

gulp
	.task('build', [bundle.build, sass.build])
	.task('clean', [bundle.clean, sass.clean])
	.task('watch', [bundle.watch, sass.watch], () => livereload.listen())
	.task('default', env.isProduction ? ['build'] : ['watch']);
