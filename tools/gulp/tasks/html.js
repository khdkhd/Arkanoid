const path = require('path');

const del = require('del');

const gulp = require('gulp');
const livereload = require('gulp-livereload');
const metalsmith = require('gulp-metalsmith');

const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const partialContent = require('tools/metalsmith/partial-content');

const semver = require('semver');

const env = require('tools/gulp/env');

const sources_dir = path.join('sources', 'html');

function Task(taskName) {
	const TaskBuilder = (target, ...deps) => function(task) {
		gulp.task(target, deps, task);
		return this;
	};

	const state = {
		build: `html-${taskName}`,
		clean: `html-${taskName}-clean`,
		watch: `html-${taskName}-watch`
	};

	return {
		clean: TaskBuilder(state.clean),
		build: TaskBuilder(state.build, state.clean),
		watch(sources) {
			gulp.task(state.watch, [state.build], () => {
				return gulp.watch(sources, [state.build]);
			});
			return this;
		},
		get tasks() {
			return Object.assign({}, state);
		}
	};
}

const tasks = [];

const game_suffix = 'index.html';
const game_source = path.join(sources_dir, game_suffix);

tasks.push(Task('game')
	.build(() => {
		return gulp
			.src(game_source)
			.pipe(gulp.dest(env.outputDirectory))
			.pipe(livereload());
	})
	.clean(() => del(path.join(env.outputDirectory, game_suffix)))
	.watch(game_source)
	.tasks
);

const changelog_layout_dir = path.join(sources_dir, 'changelog');
const changelog_content_dir = path.join('sources', 'changelogs');
const changelog_sources = [
	path.join(changelog_layout_dir, 'index.md'),
	path.join(changelog_layout_dir, 'index.hbs'),
	path.join(changelog_content_dir, '**/*.md')
];
const changelog_output_dir = path.join(env.outputDirectory, 'changelog');
tasks.push(Task('changelog')
	.build(() => {
		return gulp
			.src(changelog_sources[0])
			.pipe(metalsmith({
				use: [
					markdown(),
					partialContent({
						directory: changelog_content_dir,
						attr: 'changelogs',
						sort: files => files.sort((a, b) => {
							const va = path.basename(a, '.md');
							const vb = path.basename(b, '.md');
							if (semver.gt(va, vb)) return -1;
							if (semver.lt(va, vb)) return  1;
							return 0
						})
					}),
					layouts({
						directory: changelog_layout_dir,
						default: 'index.hbs',
						engine: 'handlebars'
					})
				]
			}))
			.pipe(gulp.dest(changelog_output_dir))
			.pipe(livereload());
	})
	.clean(() => del(path.join(changelog_output_dir, 'index.html')))
	.watch(changelog_sources)
	.tasks
);

if (env.isDevelopment) {
	const editor_suffix = path.join('editor', 'index.html');
	const editor_source = path.join(sources_dir, editor_suffix);
	const editor_output_dir = path.join(env.outputDirectory, 'editor');
	tasks.push(Task('editor')
		.build(() => {
			return gulp
				.src(editor_source)
				.pipe(gulp.dest(editor_output_dir))
				.pipe(livereload());
		})
		.clean(() => {
			return del(path.join(editor_output_dir, editor_suffix));
		})
		.watch(editor_source)
		.tasks
	);
}

module.exports = Object.entries(tasks.reduce((current, task) => {
	return {
		build: current.build.concat(task.build),
		clean: current.clean.concat(task.clean),
		watch: current.watch.concat(task.watch)
	};
}, {
	build: [],
	clean: [],
	watch: []
})).reduce((current, [target, tasks]) => {
	const gulp_target = target === 'build' ? 'html' : `html-${target}`;
	gulp.task(gulp_target, tasks);
	return Object.assign({}, current, {[target]: gulp_target});
}, {});
