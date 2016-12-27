const del = require('del');
const gulp = require('gulp');
const livereload = require('gulp-livereload');
const path = require('path');

const env = require('tools/gulp/env');

const sources_dir = path.join('sources', 'html');

const sources = (env.isDevelopment
	? path.join(sources_dir, '**/*.html')
	: path.join(sources_dir, 'index.html'));

gulp.task('html-clean', () => del(path.join(env.outputDirectory, 'index.html')));

gulp.task('html', () => gulp.src(sources)
	.pipe(gulp.dest(env.outputDirectory))
	.pipe(livereload())
);

gulp.task('html-watch', ['html'], () => gulp.watch(sources, ['html']));

module.exports = {
	build: 'html',
	clean: 'html-clean',
	watch: 'html-watch'
};
