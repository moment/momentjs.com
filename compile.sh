#!/bin/bash
set -e # exit with nonzero exit code if anything fails

npm install

rm -rf libs/moment
rm -rf libs/moment-timezone

git clone https://github.com/moment/moment.git libs/moment
git clone https://github.com/moment/moment-timezone.git libs/moment-timezone

./node_modules/.bin/grunt
cp CNAME build/CNAME
