module.exports = {
	get isProduction() {
		return !this.isDevelopment;
	},
	get isDevelopment() {
		return process.env.NODE_ENV === 'development';
	}
}
