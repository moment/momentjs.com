## Running locally

Just run `./runlocal.sh`

## Regenerating HTML and JS

You do that by running the default grunt task, but before that:

* Make sure you have the git submodules
```
git submodule update --init
```

* Install dependencies
```
npm install
cd libs/moment-timezone
npm install
```
