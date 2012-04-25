TESTJS = libs/nodeunit/nodeunit.js libs/moment/test/moment/*.js libs/moment/test/lang/*.js source/js/test.js
LANGALL = libs/moment/lang/*.js
SNIPPET = libs/snippet/jquery.snippet.js
MOMENT = libs/moment/moment.js
CSS = source/css/bootstrap.css source/css/style.css

all: jsmin html css

js:
	git submodule foreach git pull origin master
	cp $(MOMENT) deploy/js/moment.js
	cp libs/moment/min/moment.min.js deploy/js/moment.min.js
	cat $(TESTJS) > deploy/js/tests.js
	cat $(LANGALL) > deploy/js/langs.js

jsmin: js
	uglifyjs -o deploy/js/langs.min.js deploy/js/langs.js
	cat $(SNIPPET) $(MOMENT) $(LANGALL) source/js/home.js | uglifyjs -o deploy/js/home.min.js
	cat $(SNIPPET) $(MOMENT) libs/bootstrap/bootstrap.js source/js/docs.js | uglifyjs -o deploy/js/docs.min.js

html:
	node source/build.js

css:
	cat ${CSS} | cleancss -o deploy/css/style.css