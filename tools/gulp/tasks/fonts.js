const del = require('del');
const gulp = require('gulp');
const livereload = require('gulp-livereload');
const path = require('path');

const env = require('tools/gulp/env');

const output_dir =  path.join(env.outputDirectory, 'assets', 'fonts');
const sources_dir = 'sources/fonts';

gulp.task('fonts-clean', () => del(output_dir));

gulp.task('fonts', () => gulp.src(path.join(sources_dir, '**/*.ttf'))
	.pipe(gulp.dest(output_dir))
	.pipe(livereload())
);

gulp.task('fonts-watch', ['fonts'], () => gulp.watch(path.join(sources_dir, '**/*.ttf'), ['fonts']));

module.exports = {
	build: 'fonts',
	clean: 'fonts-clean',
	watch: 'fonts-watch'
};
