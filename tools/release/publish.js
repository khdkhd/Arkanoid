#! /usr/bin/env node

const chalk = require('chalk');

const inquirer = require('inquirer');

const is_nil = require('lodash.isnil');
const template = require('lodash.template');

const {die, differ, done, fail, Git, log, Package, stat} = require('tools/common');

const git = Git(process.cwd());

const confirm_tmpl = template('Your repository will be modified:'
	+ '\n' + '  - \'<%= releaseBranch %>\' will be merge into \'master\','
	+ '\n' + '  - \'master\' will be tagged with \'<%= releaseTag %>\','
	+ '\n' + '  - \'master\' will be pushed which will trigger a deployment.'
);

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

function publish({pkg, branch}) {
	log('- publish ... ');
	return Promise.resolve()
		.then(() => git.checkout('master'))
		.then(() => git.merge(branch))
		.then(() => git.tag(`v${pkg.version}`))
		.then(() => git.push(true)) // push tags
		.then(() => git.push())     // push commits
		.then(() => {
			done();
			return {pkg, branch};
		})
		.catch(fail);
}

function prompt({pkg, branch}) {
	return inquirer.prompt([{
		name: 'confirmed',
		type: 'input',
		message: () => {
			const ui = new inquirer.ui.BottomBar();
			ui.log.write(chalk.yellow(confirm_tmpl(pkg)));
			return 'Are you sure you want to continue ? (type "I agree" to confirm)';
		},
		filter: input => input === 'I agree'
	}])
	.then(answers => {
		if (answers.confirmed) {
			return {pkg, branch};
		}
		throw new Error('Release publication aborted!');
	});
}

Promise.all([Package(), git.branch()])
	.then(([pkg, branch]) => ({pkg, branch}))
	.then(check_branch)
	.then(check_changelog)
	.then(check_status)
	.then(prompt)
	.then(publish)
	.catch(die);
