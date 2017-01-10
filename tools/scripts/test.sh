#! /bin/bash

source "$PWD/tools/scripts/env"

REPORTER=${REPORTER:-"spec"}

mocha \
	--compilers js:babel-core/register \
	--require "$PWD/tests/chai-helpers.js" \
	--recursive "$PWD/tests" \
	--reporter "$REPORTER"
