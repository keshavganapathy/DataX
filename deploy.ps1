yarn build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/agoldstein03/DataDayGrind2020.git master:gh-pages
