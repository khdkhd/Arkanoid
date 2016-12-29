/*eslint strict: ["error", "never"]*/

const gulp = require('gulp');
const livereload = require('gulp-livereload');

const env = require('tools/gulp/env');

// Setup Javascript appletys task
const bundle = require('tools/gulp/tasks/bundle');

// Setup Sass tasks
const html = require('tools/gulp/tasks/html');

// Setup Sass tasks
const sass = require('tools/gulp/tasks/sass');

// Setup Fonts tasks
const fonts = require('tools/gulp/tasks/fonts');

require('tools/gulp/tasks/serve');

gulp
	.task('build', [bundle.build, html.build, sass.build, fonts.build])
	.task('clean', [bundle.clean, html.clean, sass.clean, fonts.clean])
	.task('watch', [bundle.watch, html.watch, sass.watch, fonts.watch], () => livereload.listen())
	.task('default', env.isProduction ? ['build'] : ['serve']);
