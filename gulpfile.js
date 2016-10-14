/*eslint strict: ["error", "never"]*/

const gulp = require('gulp');
const env = require('gulp/env');
const livereload = require('gulp-livereload');

// Setup Javascript appletys task
const bundle = require('gulp/tasks/bundle');

// Setup Sass tasks
const html = require('gulp/tasks/html');

// Setup Sass tasks
const sass = require('gulp/tasks/sass');

require('gulp/tasks/serve');

gulp
	.task('build', [bundle.build, html.build, sass.build])
	.task('clean', [bundle.clean, html.clean, sass.clean])
	.task('watch', [bundle.watch, html.watch, sass.watch], () => livereload.listen())
	.task('default', env.isProduction ? ['build'] : ['serve']);
