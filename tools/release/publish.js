#! /usr/bin/env node

const {die, done, fail, Git, log, Package, stat} = require('tools/common');
const is_nil = require('lodash.isnil');

const git = Git(process.cwd());

function check_branch({pkg, branch}) {
	log('- check branch ... ');
	const release_branch = pkg.releaseBranch;
	if (release_branch !== branch) {
		fail(new Error(`${branch} != ${release_branch}`));
	}
	done();
	return {pkg, branch};
}

function check_changelog({pkg, branch}) {
	log('- check changelog ... ');
	return stat(pkg.changelog)
		.then(({path, stats}) => {
			if (is_nil(stats) || !stats.isFile()) {
				throw new Error(`File '${path}' does not exist or is not a regular file!`);
			}
			done();
			return {pkg, branch}
		})
		.catch(fail);
}

function check_status({pkg, branch}) {
	log('- check repository status ... ');
	return git.status()
		.then(status => {
			if (status.length !== 0) {
				throw new Error('Some changes are not committed yet');
			}
			done();
			return {pkg, branch};
		})
		.catch(fail);
}

function merge_into_master({pkg, branch}) {
	log(`- merge ${branch} into master ... `);
	return git.checkout('master')
		.then(() => git.merge(branch))
		.then(() => {
			done();
			return {pkg, branch};
		})
		.catch(fail);
}

function tag({pkg, branch}) {
	log('- tag master ... ');
	return git.tag(`v${pkg.version}`)
		.then(() => {
			done();
			return {pkg, branch};
		})
		.catch(fail);
}

Promise.all([Package(), git.branch()])
	.then(([pkg, branch]) => ({pkg, branch}))
	.then(check_branch)
	.then(check_changelog)
	.then(check_status)
	.then(merge_into_master)
	.then(tag)
	.catch(die);
