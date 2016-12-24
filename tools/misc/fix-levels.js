const fs = require('fs');
const path = require('path');
const constant = require('lodash.constant');
const times = require('lodash.times');

function pad(str, len, ch) {
	return times(Math.max(0, len - str.length), constant(ch)).join('') + str;
}

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

function load_JSON(input_filename) {
	return load_file(input_filename).then(data => JSON.parse(data.toString()));
}

function dump_JSON(output_filename, obj) {
	return dump_file(output_filename, JSON.stringify(obj, null, '  '));
}

list_directory('../../sources/js/game/levels')
	.then(files => Promise.all(files.map(load_JSON)))
	.then(levels => levels.map(level => level.map(({color, position}) => ({
		color,
		position: {
			x: position.x - 1,
			y: position.y - 1
		}
	}))))
	.then(levels => levels.map((level, index) => {
		const level_index = pad(`${index + 1}`, 2, '0');
		dump_JSON(`levels/level-${level_index}.json`, level);
	}))
	.catch(err => process.stderr.write(err.message));
