#! /bin/bash

# exit with non-zero exit code if anything fails
set -e

# stop script with non-zero exit code when trying to reference an undefined
# variable
set -u

# If any command in a pipeline fails, that return code will be used as the
# return code of the whole pipeline
set -o pipefail

source "$PWD/tools/scripts/env"

export SSHPASS="$DEPLOY_PASSWORD"
export SSH_OPTIONS="-o stricthostkeychecking=no"

SCP="sshpass -e scp $SSH_OPTIONS"
SSH="sshpass -e ssh $SSH_OPTIONS"

pushd "$DEST_DIR"
	tar czvf ../package.tgz .
popd

RELEASE="$(./tools/release/version.js)-$TRAVIS_BUILD_NUMBER"

$SCP package.tgz "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR" > /dev/null 2>&1
$SCP tools/scripts/remote-deploy.sh "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR" > /dev/null 2>&1
$SSH "$DEPLOY_USER@$DEPLOY_HOST" "$DEPLOY_DIR/remote-deploy.sh" "$RELEASE" "$TRAVIS_COMMIT"> /dev/null 2>&1
