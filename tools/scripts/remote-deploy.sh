#! /bin/bash

pushd $(dirname $0)

SHA="$1"
DATE=$(date +"%m.%d.%y-%H:%M:%S")

# extract the package
mkdir "$SHA"
pushd "$SHA"
	tar xzf ../package.tgz
popd

# link to latest
if [ -L public ];
then
	unlink public
fi
ln -s "$SHA" public

# update deployment log file
cat >> deploy.log <<EOF
$DATE $SHA
EOF

# clean
rm package.tgz
rm remote-deploy.sh

popd

docker restart arkanoid
