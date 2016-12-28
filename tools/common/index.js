const {execFile} = require('child_process');
const fs = require('fs');
const path = require('path');

const chalk = require('chalk');

const is_nil = require('lodash.isnil');
const constant = require('lodash.constant');
const times = require('lodash.times');

const semver = require('semver');

function pad(str, len, ch) {
	return times(Math.max(0, len - str.length), constant(ch)).join('') + str;
}
exports.pad = pad;

function stat(pathname) {
	return new Promise((resolve, reject) => {
		fs.stat(pathname, (err, stats) => {
			if (err) {
				if (err.code === 'ENOENT') {
					resolve({path: pathname});
				} else {
					reject(err);
				}
			} else {
				resolve({path: pathname, stats});
			}
		});
	});
}
exports.stat = stat;

function make_directory(dirpath) {
	return new Promise((resolve, reject) => {
		fs.mkdir(dirpath, 0o755, err => {
			if (err) {
				reject(err);
			} else {
				resolve(dirpath);
			}
		})
	});
}
exports.makeDirectory = make_directory;

function load_file(input_filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(input_filename, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
exports.loadFile = load_file;

function dump_file(output_filename, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(output_filename, data, err => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
exports.dumpFile = dump_file;

function list_directory(dirname) {
	return new Promise((resolve, reject) => {
		fs.readdir(dirname, (err, files) => {
			if (err) {
				reject(err);
			} else {
				resolve(files
					.map(file => path.join(dirname, file))
					.filter(file => path.extname(file) === '.json')
				);
			}
		});
	});
}
exports.listDirectory = list_directory;

function load_JSON(input_filename) {
	return load_file(input_filename).then(data => JSON.parse(data.toString()));
}
exports.loadJSON = load_JSON;


function dump_JSON(output_filename, obj) {
	return dump_file(output_filename, JSON.stringify(obj, null, '  '));
}
exports.dumpJSON = dump_JSON;

function make_promise(fn, ...args) {
	return new Promise((resolve, reject) => {
		fn(...args, (err, ...rest) => {
			if (err) {
				reject(err);
			} else {
				resolve(...rest);
			}
		});
	});
}
exports.makePromise = make_promise;

function app() {
	return load_JSON('package.json').then(pkg => ({
		get version() {
			return pkg.version;
		},
		set version(v) {
			if (!semver.valid(v)) {
				throw new TypeError(`Invalid version number '${v}'!`);
			}
			pkg.version = v;
		},
		bump(release) {
			return semver.inc(pkg.version, release);
		},
		dump() {
			return dump_JSON('package.json', pkg);
		}
	}));
}
exports.app = app;

exports.git = {
	stage(...files) {
		return make_promise(execFile, 'git', ['add', ...files]);
	},
	branch(branch) {
		return make_promise(execFile, 'git', ['checkout', '-b', branch]);
	},
	commit(message) {
		return make_promise(execFile, 'git', ['commit', '-m', message]);
	}
}

function log(msg) {
	process.stderr.write(msg);
}
exports.log = log;

function die(err) {
	process.stderr.write(err.message);
	process.exit(1);
}
exports.die = die;

function done(next) {
	log(chalk.green('✔︎\n'));
	if (!is_nil(next)) {
		next();
	}
}
exports.done = done;

function fail(err, next) {
	log(chalk.red('✘\n'));
	if (!is_nil(next)) {
		next(err);
	} else {
		throw err;
	}
}
exports.fail = fail;
