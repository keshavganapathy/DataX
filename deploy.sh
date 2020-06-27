#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/agoldstein03/DataDayGrind2020.git master:gh-pages

cd -