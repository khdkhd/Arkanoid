const del = require('del');
const env = require('gulp/env');
const gulp = require('gulp');
const livereload = require('gulp-livereload');
const path = require('path');

const sources_dir = 'sources';

gulp.task('html-clean', () => del(path.join(env.outputDirectory, 'index.html')));

gulp.task('html', () => gulp.src(path.join(sources_dir, 'index.html'))
	.pipe(gulp.dest(env.outputDirectory))
	.pipe(livereload())
);

gulp.task('html-watch', ['html'], () => gulp.watch(path.join(sources_dir, 'index.html'), ['html']));

module.exports = {
	build: 'html',
	clean: 'html-clean',
	watch: 'html-watch'
};
