#! /usr/bin/env node

const {die, Package} = require('tools/common');

Package()
	.then(({version}) => process.stdout.write(version))
	.catch(die);
