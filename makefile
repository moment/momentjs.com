TESTJS = libs/nodeunit/nodeunit.js libs/moment/test/moment/*.js libs/moment/test/lang/*.js source/js/test.js
LANGALL = libs/moment/lang/*.js
MOMENT = libs/moment/moment.js
CSS = source/css/bootstrap.css source/css/style.css

all: jsmin html css

js:
	git submodule foreach git pull origin master
	cp $(MOMENT) js/moment.js
	cp libs/moment/min/moment.min.js js/moment.min.js
	cat $(TESTJS) > js/tests.js
	cat $(LANGALL) > js/langs.js

jsmin: js
	uglifyjs -o js/langs.min.js js/langs.js
	cat $(MOMENT) $(LANGALL) source/js/home.js | uglifyjs -o js/home.min.js

html:
	node source/build.js

css:
	cat ${CSS} | cleancss -o css/style.css