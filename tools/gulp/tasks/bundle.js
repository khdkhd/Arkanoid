const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const del = require('del');
const env = require('gulp/env');
const gulp = require('gulp');
const gulp_if = require('gulp-if');
const gutil = require('gulp-util');
const livereload = require('gulp-livereload');
const path = require('path');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const output_dir = path.join(env.outputDirectory, 'assets', 'js');
const sources_dir = path.join('sources', 'js');
const app_source = path.join(sources_dir, 'main.js');

const browserify_base_options = {
	debug: true,
	paths: ['node_modules', sources_dir],
	transform: [
		[
			'babelify', {
				presets: ['es2015'],
				plugins: ['transform-runtime']
			}
		]
	]
};

function bundle(bundler) {
	return bundler
		.bundle()
		.on('error', (err) => {
			gutil.log(err.message);
			err.stream.end();
		})
		.pipe(source('arkanoid.js'))
		.pipe(buffer())
		// .pipe(sourcemaps.init({loadMaps: true, debug: true}))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(gulp_if(!env.isDevelopment, uglify()))
		.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest(output_dir))
		.pipe(livereload());
}

function create_browserify_bundler(options) {
	return browserify(
		app_source,
		Object.assign({}, browserify_base_options, options || {})
	);
}

function create_watchify_bundler(bundle) {
	const bundler = watchify(create_browserify_bundler(watchify.args));
	bundler
		.on('update', (ids) => {
			gutil.log('Update:');
			ids.forEach((id) => gutil.log(` - ${id}`))
			bundle(bundler);
		})
		.on('log', gutil.log)
	return bundler;
}

gulp.task('bundle', () => bundle(create_browserify_bundler()));
gulp.task('bundle-clean', () => del(output_dir));
gulp.task('bundle-watch', ['bundle'], () => bundle(create_watchify_bundler(bundle)));

module.exports = {
	build: 'bundle',
	clean: 'bundle-clean',
	watch: 'bundle-watch'
};
