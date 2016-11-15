module.exports = {
	get isProduction() {
		return !this.isDevelopment;
	},
	get isDevelopment() {
		return process.env.NODE_ENV === 'development';
	},
	get outputDirectory() {
		return process.env.BUILD_OUTPUT_DIR || 'public';
	},
	get target() {
		return process.env.TARGET || 'main.js'
	}
}
