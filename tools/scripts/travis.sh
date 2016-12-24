#! /bin/bash

# stop script with non-zero exit code if anything go wrong
set -e

# stop script with non-zero exit code when trying to reference an undefined
# variable
set -u

# If any command in a pipeline fails, that return code will be used as the
# return code of the whole pipeline
set -o pipefail

if [ "$TRAVIS_BRANCH" = "master" ] || [ "$TRAVIS_BRANCH" = "develop" ];
	then
	./node_modules/.bin/eslint sources
	npm run test
fi

npm run build
