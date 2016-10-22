#! /bin/bash

source "$PWD/tools/scripts/env"

REPORTER=${REPORTER:-"spec"}

mocha --compilers js:babel-core/register --recursive "$PWD/tests" --reporter "$REPORTER"
