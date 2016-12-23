#! /bin/bash

# exit with non-zero exit code if anything fails
set -e

USER_NAME="Travis CI"
USER_EMAIL="julien@graziano.fr"

GH_REF="${GH_REF:-khdkhd/arkanoid.github.io.git}"
DATE=$(date +"%m.%d.%y")
SHA=$(git rev-parse HEAD)

pushd "$DEST_DIR"
	git init
	git config user.name "$USER_NAME"
	git config user.email "$USER_EMAIL"
	git add .
	git commit -F- <<-EOF
		Deploy $DATE
		commit: khdkhd/Arkanoid@$SHA
	EOF
	git push --force --quiet "https://${GH_TOKEN}@github.com/${GH_REF}" master:master > /dev/null 2>&1
popd
