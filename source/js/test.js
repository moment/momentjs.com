/*global moment:false*/

(function(){
	var banner = $('#nodeunit-banner');
	var tests = $('#nodeunit-tests');
	var headerRow = $("#header-row");

	var start = moment();
	var passed = 0;
	var failed = 0;
	var total = 0;
	var currentTestModule;

	function updateTest(_passed, _failed) {
		passed += _passed;
		failed += _failed;
		updateTotals(passed, failed);
	}

	function updateTotals(_passed, _failed) {
		var duration = moment().diff(start);
		if (_failed) {
			banner.removeClass('pass');
			banner.addClass('fail');
		}
		banner.html('<h3><span class="counter">' + _passed + '</span> tests passed. <span class="counter">' + _failed + '</span> failed.</h3>');
	}

	(function() {
		var queryArgs = {}, query = window.location.search, pieces, i, key_val,
			filtered, suite, test;
		if (!query) { return; }
		if (query[query.length - 1] === '/') {
			query = query.slice(0, query.length - 1);
		}
		pieces = query.slice(1).split('&');
		for (i = 0; i < pieces.length; ++i) {
			key_val = pieces[i].split('=');
			queryArgs[decodeURIComponent(key_val[0])] = decodeURIComponent(key_val[1]);
		}
		if (queryArgs.suite !== undefined) {
			filtered = {};
			for (suite in exports) {
				if (suite.match(queryArgs.suite)) {
					filtered[suite] = exports[suite];
				}
			}
			exports = filtered;
		}
		if (queryArgs.test !== undefined) {
			for (suite in exports) {
				filtered = {};
				for (test in exports[suite]) {
					if (test === 'setUp' || test === 'tearDown' || test.match(queryArgs.test)) {
						filtered[test] = exports[suite][test];
					}
				}
				exports[suite] = filtered;
			}
		}
	}());

	nodeunit.runModules(exports, {
		moduleStart : function (name) {
			tests.append('<h3>' + name + '</h3>');
			currentTestModule = name;
		},
		testDone : function (name, assertions) {
			var testEl = $('<li>'),
				testHtml = '',
				assertUl = $('<ul>'),
				assertLi,
				assertHtml = '';
				assert;

			total++;

			// each test
			testHtml += '<div class="title"><strong>' + name + '</strong> ';
			if (assertions.failures()) {
				testEl.addClass('fail open');
				testHtml += assertions.passes() + ' passed,';
				testHtml += assertions.failures() + ' failed.</div>';
			} else {
				testEl.addClass('pass');
				testHtml += 'All ' + assertions.passes() + ' passed.</div>';
			}
			testEl.addClass('test');
			testEl.html(testHtml);

			// each assert
			for (var i = 0; i < assertions.length; i++) {
				assert = assertions[i];
				assert.uid = total + '.' + (i + 1);
				assert.test_name = name;
				assert.module_name = currentTestModule;
				assertLi = $('<li>');
				assertHtml = '<strong>' + assert.uid + '</strong> ';
				assertHtml += (assert.message || assert.method || 'no message');
				if (assert.failed()) {
					assertHtml += ' (' + assert.error.expected + ' ' + assert.error.operator + ' ' + assert.error.actual + ')';
					assertHtml += '<pre>' + (assert.error.stack || assert.error) + '</pre>';
					assertLi.addClass('fail');
				} else {
					assertLi.addClass('pass');
				}
				assertLi.html(assertHtml);
				assertUl.append(assertLi);
			}

			testEl.append(assertUl);
			tests.append(testEl);
			updateTest(assertions.passes(), assertions.failures());
		},
		done : function (assertions) {
			var duration = moment().diff(start),
				failures = assertions.failures(),
				assert, error, i,
				reportHTML = '',
				header,
				expression,
				submitUrl = "https://github.com/moment/moment/issues/new",
				searchUrl = "https://github.com/moment/moment/search",
				titleText = "" + failures + " test" + (failures !== 1 ? "s" : "") + " failed. ",
				bodyText = [
					"### Client info",
					'```',
					"Date String   : " + (new Date()).toString(),
					"Locale String : " + (new Date()).toLocaleString(),
					"Offset        : " + (new Date(1000)).getTimezoneOffset(),
					"User Agent    : " + navigator.userAgent,
					'```'
				];

			for (i = 0; i < assertions.length; ++i) {
				assert = assertions[i];
				error = assert.error;

				if (!assert.failed()) {
					continue;
				}

				header = assert.module_name + ':' + assert.test_name + ' (' + assert.uid + ') ';
				titleText += header;

				bodyText.push('');
				bodyText.push('====');
				bodyText.push('');
				bodyText.push('### ' + header);
				bodyText.push('');
				bodyText.push(assert.message);
				bodyText.push('');
				bodyText.push('```javascript');
				bodyText.push('// Expected ' + error.expected);
				bodyText.push('// Actual   ' + error.actual);

				expression = typeof error.actual === 'string' ? '"' + error.actual.replace('"', '\\"') + '"' : error.actual;
				expression += ' ' + error.operator + ' ';
				expression += typeof error.expected === 'string' ? '"' + error.expected.replace('"', '\\"') + '"' : error.expected;

				bodyText.push(expression);
				bodyText.push('```');
				console.log(assert, error);
			}

			bodyText = bodyText.join('\n');

			submitUrl += '?title=' + encodeURIComponent(titleText);
			submitUrl += '&body=' + encodeURIComponent(bodyText);

			searchUrl += '?type=Issues&q=' + encodeURIComponent(titleText);

			if (failures) {
				reportHTML += '<h2>Hmm, looks like some of the unit tests are failing.</h2>';
				reportHTML += "<p>It's hard to catch bugs across all browsers and timezones. If you have a minute, please report the failing test.</p>";
				reportHTML += "<p>First, check if the issue has already been reported by searching the issues on github.</p>";
				reportHTML += "<a class='button' href='" + searchUrl + "' target='_blank'>Search failed tests</a>";
				reportHTML += "<p>If it doesn't look like this failed test has been reported yet, submit an issue with the following info.</p>";
				reportHTML += "<a class='button' href='" + submitUrl + "' target='_blank'>Report failed test</a>";
				reportHTML += '<h3>Title</h3>';
				reportHTML += '<pre>' + titleText + '</pre>';
				reportHTML += '<h3>Body</h3>';
				reportHTML += '<pre>' + bodyText.replace(/\n/g, '<br/>') + '</pre>';
			} else {
				reportHTML += "<p class='success'>Awesome, all the unit tests passed!</p>";
			}

			banner.after('<div class="test-reporting">' + reportHTML + '<div>');

			updateTotals(assertions.passes(), failures);
		}
	});

	tests.on('click', 'li.test', function(){
		$(this).toggleClass('open');
	});
})();
