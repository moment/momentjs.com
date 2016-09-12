#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# oh well, this thing returns 1 for me even if its fine
npm install || true

rm -rf libs/moment
rm -rf libs/moment-timezone

git clone https://github.com/moment/moment.git libs/moment
git clone https://github.com/moment/moment-timezone.git libs/moment-timezone

moment_version=$(gawk ' /"moment": "/ { print substr($2, 2, length($2) - 3) } ' package.json)
moment_timezone_version=$(gawk ' /"moment-timezone": "/ { print substr($2, 2, length($2) - 3) } ' package.json)

pushd libs/moment ; git checkout $moment_version ; popd
pushd libs/moment-timezone ; git checkout $moment_timezone_version ; popd

./node_modules/.bin/grunt
cp CNAME build/CNAME
