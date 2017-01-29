#! /bin/bash

source "$PWD/tools/scripts/env"

REPORTER=${REPORTER:-"spec"}

if [ -z "$*" ];
then
	mocha \
		--compilers js:babel-core/register \
		--require "$PWD/tests/chai-helpers.js" \
		--recursive "$PWD/tests" \
		--reporter "$REPORTER"
else
	mocha \
		--compilers js:babel-core/register \
		--require "$PWD/tests/chai-helpers.js" \
		--reporter "$REPORTER" \
		"$@"
fi
