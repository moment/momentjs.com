npm install

Remove-Item libs/moment -Recurse -Force -ErrorAction Ignore
Remove-Item libs/moment-timezone -Recurse -Force -ErrorAction Ignore

git clone https://github.com/moment/moment.git libs/moment
git clone https://github.com/moment/moment-timezone.git libs/moment-timezone

$json = Get-Content .\package.json -Raw | ConvertFrom-Json

#moment_version
Push-Location libs/moment
git checkout $json.devDependencies.moment
Pop-Location

#moment_timezone_version
Push-Location libs/moment-timezone
git checkout $json.devDependencies.'moment-timezone'
Pop-Location

./node_modules/.bin/grunt

Copy-Item CNAME build -Recurse -Force