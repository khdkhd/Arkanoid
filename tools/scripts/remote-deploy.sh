#! /bin/bash

pushd $(dirname $0)

TAG="$1"
DATE=$(date +"%m.%d.%y-%H:%M:%S")

# extract the package
mkdir "$TAG"
pushd "$TAG"
	tar xzf ../package.tgz
popd

# link to latest
if [ -L public ];
then
	unlink public
fi
ln -s "$TAG" public

# update deployment log file
cat >> deploy.log <<EOF
$DATE $TAG
EOF

# clean
rm package.tgz
rm remote-deploy.sh

popd

docker restart arkanoid
