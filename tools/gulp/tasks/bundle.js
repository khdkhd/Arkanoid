const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const del = require('del');
const gulp = require('gulp');
const gulp_if = require('gulp-if');
const gutil = require('gulp-util');
const livereload = require('gulp-livereload');
const path = require('path');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const transform_SVG = require('tools/browserify/svg');
const transform_TMPL = require('tools/browserify/template');

const env = require('tools/gulp/env');

const output_dir = path.join(env.outputDirectory, 'assets', 'js');
const sources_dir = path.join('sources', 'js');

const browserify_base_options = {
	debug: true,
	paths: ['node_modules', sources_dir],
	transform: [[
		'babelify', {
			presets: ['es2015'],
			plugins: ['transform-runtime']
		}
	], [
		transform_SVG
	], [
		transform_TMPL
	]]
};

const bundles = Object.assign(
	{arkanoid: path.join(sources_dir, env.target)},
	env.isDevelopment ? {editor: path.join(sources_dir, 'editor', 'main.js')}: {},
	env.isDevelopment ? {sound: path.join(sources_dir, 'sound', 'arkanoid', 'main.js')}: {}
);

Object.entries(bundles).forEach(([bundle_name, entry_point]) => {
	function bundle(bundler) {
		return bundler
			.bundle()
			.on('error', (err) => {
				gutil.log(
					gutil.colors.red('Browserify compile error: '),
					err.message, '\n\t'
				);
				if (env.isProduction) {
					err.stream.end();
					process.exit(1);
				}
			})
			.pipe(source(`${bundle_name}.js`))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(gulp_if(!env.isDevelopment, uglify()))
			.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
			.pipe(gulp.dest(output_dir))
			.pipe(livereload());
	}

	function create_browserify_bundler(options) {
		return browserify(
			entry_point,
			Object.assign({}, browserify_base_options, options || {})
		);
	}

	function create_watchify_bundler(bundle) {
		const bundler = watchify(create_browserify_bundler(entry_point, watchify.args));
		bundler
			.on('update', (ids) => {
				gutil.log('Update:');
				ids.forEach((id) => gutil.log(` - ${id}`))
				bundle(bundler);
			})
			.on('log', gutil.log)
		return bundler;
	}

	const task_base_name = `${bundle_name}-bundle`

	gulp.task(task_base_name, () => bundle(create_browserify_bundler()));
	gulp.task(`${task_base_name}-clean`, () => del(output_dir));
	gulp.task(`${task_base_name}-watch`, [task_base_name], () => bundle(create_watchify_bundler(bundle)));
});

const tasks = Object.keys(bundles).reduce((value, bundle) => ({
	// reducer
	'bundle':       [].concat(value['bundle'], `${bundle}-bundle`),
	'bundle-clean': [].concat(value['bundle-clean'], `${bundle}-bundle-clean`),
	'bundle-watch': [].concat(value['bundle-watch'], `${bundle}-bundle-watch`)
}), {
	// initial value
	'bundle':       [],
	'bundle-clean': [],
	'bundle-watch': []
});

Object.entries(tasks).forEach(([task, deps]) => {
	gulp.task(task, deps)
});

module.exports = {
	build: 'bundle',
	clean: 'bundle-clean',
	watch: 'bundle-watch'
};
