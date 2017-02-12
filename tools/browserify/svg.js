const through = require('through2');
const SVGO = require('svgo');

module.exports = file => {
	const buffers = [];
	if (!/\.svg$/.test(file)) {
		return through();
	}
	return through(
		(chunk, enc, next) => {
			buffers.push(chunk);
			next();
		},
		function(next) {
			const svgo = new SVGO({
				plugins: [{
					removeDoctype: true
				}, {
					removeXMLProcInst: true
				}]
			});
			svgo.optimize(Buffer.concat(buffers).toString(), ({data}) => {
				next(null, `module.exports = '${data}';`);
			});
		}
	)
};
