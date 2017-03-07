const through = require('through2');
const template = require('lodash.template');

const module_template = template(
	'const template = require("lodash.template");'
	+ 'module.exports = template(`<%= template_data %>`);'
);

module.exports = file => {
	const buffers = [];
	if (!/\.tmpl$/.test(file)) {
		return through();
	}
	return through(
		(chunk, enc, next) => {
			buffers.push(chunk);
			next();
		},
		function(next) {
			const template_data = Buffer.concat(buffers).toString();
			const mod = module_template({template_data});
			return next(null, mod);
		}
	)
};
