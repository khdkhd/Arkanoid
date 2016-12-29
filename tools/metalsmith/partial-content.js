const handlebars = require('handlebars');
const front_matter = require('front-matter');

const marked = require('marked');

const is_nil = require('lodash.isnil');
const identity = require('lodash.identity');

const fs = require('fs-extra');
const path = require('path');

const {loadFile, mapSeries} = require('tools/common');

const through2 = require('through2')

const excludeDirFilter = () => through2.obj(function(item, enc, next) {
	if (!item.stats.isDirectory()) {
		this.push(item);
	}
	next();
});

function partial_name(directory, filepath) {
	return `${path.basename(directory)}/${path.basename(filepath, '.md')}`;
}

function handle_partials(directory, sort) {
	const handle_partial = filepath => {
		return loadFile(filepath)
			.then(data => front_matter(data.toString()))
			.then(data => ({
				metadata: data.attributes,
				content: marked(data.body)
			}))
			.then(({metadata, content}) => {
				const partial = partial_name(directory, filepath);
				handlebars.registerPartial(partial, content);
				return {
					partial,
					metadata
				};
			});
	}
	return new Promise((resolve, reject) => {
		const stream  = fs.walk(directory);
		const files = [];
		stream
			.pipe(excludeDirFilter())
			.on('data', item => {
				files.push(item.path);
			})
			.once('end',  err => {
				if (!is_nil(err)) {
					reject(err);
				} else {
					mapSeries(sort(files), handle_partial)
						.then(resolve)
						.catch(reject);
				}
			});
	});
}

module.exports = ({directory, attr = 'partials', sort = identity}) => {
	if (is_nil(directory)) {
		throw new TypeError('directory must be specified');
	}
	return (files, metalsmith, done) => {
		handle_partials(directory, sort)
			.then(partials => {
				for (let file of Object.values(files)) {
					file[attr] = partials;
				}
				done();
			})
			.catch(done);
	};
};
