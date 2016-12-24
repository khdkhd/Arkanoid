#! /bin/bash

pushd $(dirname $0)

RELEASE="$1"
DATE=$(date +"%m.%d.%y-%H:%M:%S")

# extract the package
mkdir -p "$RELEASE"
pushd "$RELEASE"
	tar xzf ../package.tgz
popd

# link to latest
if [ -L public ];
then
	unlink public
fi
ln -s "$PWD/$RELEASE" public

# update deployment log file
cat >> deploy.log <<EOF
$DATE $RELEASE
EOF

# clean
rm package.tgz
rm remote-deploy.sh

popd

docker restart arkanoid
